// Mango vs Non-Mango Classification
// Models: RF, MDC, MLC
// Study Area: Nuzvid, Andhra Pradesh
// Year: 2020
// Author: Shalem Raju
// ================== AOI ==================
var nuzvidAOI = ee.Geometry.Rectangle([80.8215, 16.7631, 80.8715, 16.8131]);
Map.centerObject(nuzvidAOI, 12);

// ================== Sentinel-2 (HARMONIZED) ==================
var s2Collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(nuzvidAOI)
  .filterDate('2020-01-01', '2020-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .select(['B2','B3','B4','B5','B6','B7','B8','B8A','B11','B12']);  // IMPORTANT FIX

var s2 = s2Collection.median().clip(nuzvidAOI);

// ================== Vegetation Indices ==================
var ndvi = s2.normalizedDifference(['B8', 'B4']).rename('NDVI');

var evi = s2.expression(
  '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
    'NIR': s2.select('B8'),
    'RED': s2.select('B4'),
    'BLUE': s2.select('B2')
}).rename('EVI');

var savi = s2.expression(
  '((NIR - RED) / (NIR + RED + 0.5)) * 1.5', {
    'NIR': s2.select('B8'),
    'RED': s2.select('B4')
}).rename('SAVI');

var gndvi = s2.normalizedDifference(['B8', 'B3']).rename('GNDVI');

// ================== Stack Bands ==================
var s2All = s2.addBands([ndvi, evi, savi, gndvi]);

var bands = [
  'B2','B3','B4','B5','B6','B7','B8','B8A','B11','B12',
  'NDVI','EVI','SAVI','GNDVI'
];

// ================== ESA WorldCover 2020 ==================
var esa = ee.ImageCollection("ESA/WorldCover/v100")
  .first()
  .clip(nuzvidAOI)
  .select('Map');

// Class codes
var mangoCode = 10;        // Tree Cover (proxy mango)
var croplandCode = 40;     // Cropland
var nonMangoCodes = [20, 30, 50, 60, 80, 90, 95, 100];

// ================== Training Samples ==================
var mangoSamples = esa.eq(mangoCode).selfMask()
  .stratifiedSample({
    numPoints: 800,
    region: nuzvidAOI,
    scale: 10,
    geometries: true
  }).map(function(f){ return f.set('class', 1); });

var croplandSamples = esa.eq(croplandCode).selfMask()
  .stratifiedSample({
    numPoints: 800,
    region: nuzvidAOI,
    scale: 10,
    geometries: true
  }).map(function(f){ return f.set('class', 3); });

var nonMangoSamplesList = nonMangoCodes.map(function(code){
  return esa.eq(code).selfMask()
    .stratifiedSample({
      numPoints: 800 / nonMangoCodes.length,
      region: nuzvidAOI,
      scale: 10,
      geometries: true
    }).map(function(f){ return f.set('class', 2); });
});

var nonMangoSamples = ee.FeatureCollection(nonMangoSamplesList).flatten();

var trainingSamples = mangoSamples.merge(croplandSamples)
                                  .merge(nonMangoSamples);

// ================== Extract Spectral Values ==================
var training = s2All.select(bands).sampleRegions({
  collection: trainingSamples,
  properties: ['class'],
  scale: 10,
  geometries: true
});

// ================== Train/Test Split ==================
var withRandom = training.randomColumn('random');
var trainSet = withRandom.filter(ee.Filter.lt('random', 0.7));
var testSet  = withRandom.filter(ee.Filter.gte('random', 0.7));

// ================== Train Classifiers ==================
var rfClassifier = ee.Classifier.smileRandomForest(150).train({
  features: trainSet,
  classProperty: 'class',
  inputProperties: bands
});

var mdcClassifier = ee.Classifier.minimumDistance().train({
  features: trainSet,
  classProperty: 'class',
  inputProperties: bands
});

var mlcClassifier = ee.Classifier.smileNaiveBayes().train({
  features: trainSet,
  classProperty: 'class',
  inputProperties: bands
});

// ================== Apply Classification ==================
var rfResult  = s2All.select(bands).classify(rfClassifier);
var mdcResult = s2All.select(bands).classify(mdcClassifier);
var mlcResult = s2All.select(bands).classify(mlcClassifier);

// Smooth results
var rfSmooth  = rfResult.focal_mode(1);
var mdcSmooth = mdcResult.focal_mode(1);
var mlcSmooth = mlcResult.focal_mode(1);

// ================== Visualization ==================
var vis = {min:1, max:3, palette:['yellow','pink','green']};

Map.addLayer(rfSmooth, vis, 'RF');
Map.addLayer(mdcSmooth, vis, 'MDC');
Map.addLayer(mlcSmooth, vis, 'MLC');

// ================== Accuracy Assessment ==================
var testRF = testSet.classify(rfClassifier);
var rfCM = testRF.errorMatrix('class','classification');
print('RF Confusion Matrix', rfCM);
print('RF Overall Accuracy', rfCM.accuracy());

var testMDC = testSet.classify(mdcClassifier);
var mdcCM = testMDC.errorMatrix('class','classification');
print('MDC Confusion Matrix', mdcCM);
print('MDC Overall Accuracy', mdcCM.accuracy());

var testMLC = testSet.classify(mlcClassifier);
var mlcCM = testMLC.errorMatrix('class','classification');
print('MLC Confusion Matrix', mlcCM);
print('MLC Overall Accuracy', mlcCM.accuracy());

// ================== External ESA Validation ==================
var esaRemap = esa.remap(
  [mangoCode].concat(nonMangoCodes).concat([croplandCode]),
  ee.List.repeat(1,1)
    .cat(ee.List.repeat(2, nonMangoCodes.length))
    .cat(ee.List.repeat(3,1))
).rename('class');

var esaSamples = esaRemap.sample({
  region: nuzvidAOI,
  scale: 10,
  numPixels: 5000,
  geometries: true
});

var esaPointsWithBands = s2All.select(bands).sampleRegions({
  collection: esaSamples,
  properties: ['class'],
  scale: 10
});

var rfCompare = esaPointsWithBands.classify(rfClassifier);
var rfESAcm = rfCompare.errorMatrix('class','classification');
print('RF vs ESA Confusion Matrix', rfESAcm);
print('RF vs ESA Overall Accuracy', rfESAcm.accuracy());

Map.addLayer(esaRemap, vis, 'ESA Reference');

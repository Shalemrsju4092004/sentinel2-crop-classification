# Sentinel-2 Multi-Class Land Cover Classification using Google Earth Engine

## Overview

This project performs 3-class land cover classification using Sentinel-2 multispectral imagery in Google Earth Engine (JavaScript API).

The objective was to distinguish:

- Mango Orchards (Class 1)
- Other Trees / Vegetation (Class 2)
- Built-up / Non-vegetation Areas (Class 3)

Three supervised machine learning models were implemented and compared:

- Random Forest (RF)
- Minimum Distance Classifier (MDC)
- Maximum Likelihood Classifier (MLC)

---

## Study Area

Location: Nuzvid, Andhra Pradesh, India  
Time Period: 2020  
Satellite Data: Sentinel-2 SR Harmonized  
Reference Data: ESA WorldCover 2020  

---

## Features Used

Sentinel-2 Spectral Bands:
B2, B3, B4, B5, B6, B7, B8, B8A, B11, B12

Vegetation Indices:
- NDVI
- EVI
- SAVI
- GNDVI

Total Features Used: 14

---

## Methodology

1. Sentinel-2 Image Filtering (Cloud < 20%)
2. Median Composite Generation
3. Vegetation Index Computation
4. Feature Stacking (Bands + Indices)
5. Stratified Sampling using ESA WorldCover
6. 70/30 Train-Test Split
7. Model Training:
   - Random Forest (150 Trees)
   - Minimum Distance Classifier
   - Naive Bayes (as MLC approximation)
8. Post-classification smoothing
9. Accuracy Assessment (Confusion Matrix)
10. External Validation using ESA reference data

---

## Classification Performance

### Internal Validation (70/30 Split)

| Model | Overall Accuracy |
|-------|------------------|
| Random Forest (RF) | 74.67% |
| Minimum Distance (MDC) | 70.72% |
| Maximum Likelihood (MLC) | 67.27% |

### External ESA Validation

| Model | Overall Accuracy |
|-------|------------------|
| RF vs ESA | 75.48% |

---

## Classification Legend

- Yellow → Mango Orchards
- Green → Other Trees / Vegetation
- Pink → Built-up / Non-vegetation

---

## Sample Output

![RF Classification](outputs/rf_result.jpg)

---

## Key Findings

- Random Forest achieved the highest accuracy and best class separation.
- MDC performed moderately well.
- MLC showed lower stability in multi-class separation.
- RF demonstrated better generalization when validated against ESA reference data.

---

## Technologies Used

- Google Earth Engine (JavaScript API)
- Sentinel-2 Multispectral Imagery
- ESA WorldCover 2020
- Remote Sensing Feature Engineering
- Supervised Machine Learning

---

## How to Run

1. Open Google Earth Engine Code Editor
2. Copy main.js
3. Run the script
4. View classification layers:
   - RF
   - MDC
   - MLC
5. Check Console for confusion matrices and accuracy

---

## Author

Shalem Raju  
B.Tech (AI & ML)  
KL University

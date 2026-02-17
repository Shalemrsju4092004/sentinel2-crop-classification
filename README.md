# sentinel2-crop-classification
Machine learning-based crop classification using Sentinel-2 multispectral imagery with spectral indexing and feature engineering.
# Sentinel-2 Mango Classification using Google Earth Engine

## Overview

This project focuses on identifying Mango and Non-Mango areas using Sentinel-2 multispectral imagery in Google Earth Engine (GEE). 

Three supervised classification algorithms were implemented and compared:

- Random Forest (RF)
- Maximum Likelihood Classifier (MLC)
- Minimum Distance Classifier (MDC)

The objective was to evaluate classification performance and generate accurate mango orchard maps.

---

## Study Area

Region of Interest (ROI): [Add your location here – e.g., Krishna Delta, Andhra Pradesh]

Time Period: [Add date range used]

---

## Data Used

- Sentinel-2 Level-2A Multispectral Imagery
- Bands Used: B2 (Blue), B3 (Green), B4 (Red), B8 (NIR)
- Derived Spectral Index:
  - NDVI (Normalized Difference Vegetation Index)

---

## Methodology

1. Data Collection from Sentinel-2 in GEE
2. Cloud Masking and Preprocessing
3. ROI Selection and Training Sample Collection
4. Feature Extraction using spectral bands and NDVI
5. Model Training using:
   - Random Forest (RF)
   - Maximum Likelihood Classifier (MLC)
   - Minimum Distance Classifier (MDC)
6. Classification Map Generation
7. Accuracy Assessment using confusion matrix

---

## Models Used

### 1. Random Forest (RF)
Ensemble-based supervised learning algorithm that builds multiple decision trees and aggregates predictions for higher accuracy and robustness.

### 2. Maximum Likelihood Classifier (MLC)
Probabilistic classifier that assumes normal distribution of classes and assigns pixels based on highest probability.

### 3. Minimum Distance Classifier (MDC)
Distance-based classifier that assigns pixels to the nearest class mean in feature space.

---

## Results

- Mango areas successfully identified and visualized on the classification map.
- Random Forest showed higher stability and better classification performance compared to MLC and MDC.
- Performance was evaluated using overall accuracy and confusion matrix.

(Add your actual accuracy if available)

---

## Technologies Used

- Google Earth Engine (JavaScript API)
- Sentinel-2 Multispectral Data
- Remote Sensing & Spectral Indexing
- Supervised Machine Learning

---

## Output

The final output includes:
- Mango vs Non-Mango classification map
- Accuracy metrics
- Comparison between RF, MLC, and MDC

(Add screenshot of output map here)

---

## How to Run

1. Open Google Earth Engine Code Editor
2. Copy the `main.js` script
3. Replace ROI if needed
4. Run the script to generate classification results

---

## Future Improvements

- Incorporate additional vegetation indices
- Apply deep learning-based classification
- Expand study area
- Multi-season analysis

---

## Author

Shalem Raju  
B.Tech (AI & ML)  
KL University  

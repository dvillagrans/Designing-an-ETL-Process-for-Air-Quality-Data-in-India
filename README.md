# Designing an ETL Process for Air Quality Data in India

An end-to-end data engineering project that designs and implements an ETL pipeline for processing air quality monitoring data across India. The pipeline covers data extraction from Kaggle, quality profiling, transformation with Apache Spark, storage in Parquet format, and visualization through an interactive web dashboard.

## Table of Contents

- [Overview](#overview)
- [Dataset](#dataset)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Pipeline Stages](#pipeline-stages)
- [Web Dashboard](#web-dashboard)
- [Data Schema](#data-schema)
- [License](#license)

---

## Overview

India operates one of the largest ambient air quality monitoring networks in the world. This project ingests that data and walks through each stage of a layered ETL architecture — from raw CSV files to a refined, analytics-ready dataset — while producing exploratory profiling reports and an interactive dashboard to communicate findings.

**Key objectives:**

- Implement a reproducible, modular ETL pipeline using Python and Apache Spark.
- Apply data quality profiling at the raw zone stage using `ydata_profiling`.
- Encode categorical air quality classifications numerically for downstream modelling.
- Expose results through a Next.js web application with interactive Recharts visualisations.

---

## Dataset

**Source:** [Air Quality Data in India — Kaggle](https://www.kaggle.com/datasets/rohanrao/air-quality-data-in-india)  
**Author:** Rohan Rao  
**Coverage:** 2015 – 2020 across 26 cities and multiple monitoring stations

| File | Description |
|---|---|
| `city_day.csv` | Daily aggregated measurements per city (PM2.5, PM10, NO, NO2, CO, SO2, O3, AQI, AQI\_Bucket) |
| `city_hour.csv` | Hourly aggregated measurements per city |
| `station_day.csv` | Daily measurements per monitoring station |
| `station_hour.csv` | Hourly measurements per monitoring station |
| `stations.csv` | Station catalogue (name, city, state, latitude, longitude) |

---

## Architecture

The pipeline follows a multi-zone layered architecture:

```
Kaggle API
    |
    v
Landing Zone          Raw CSV files downloaded via scripts/extract.py
    |
    v
Raw Zone              Data quality reports generated with ydata_profiling
    |
    v
Refined Zone          Cleaned, encoded Parquet files + aqi_bucket_mapping.json
    |
    v
Analytics             Apache Spark SQL queries + Next.js dashboard
```

**AQI classification scheme used throughout the pipeline:**

| Bucket | AQI Range | Encoded Value |
|---|---|---|
| Good | 0 – 50 | 0 |
| Satisfactory | 51 – 100 | 1 |
| Moderate | 101 – 200 | 2 |
| Poor | 201 – 300 | 3 |
| Very Poor | 301 – 400 | 4 |
| Severe | 401+ | 5 |

---

## Repository Structure

```
.
├── data/
│   ├── landing-zone/           # Raw CSVs downloaded from Kaggle (git-ignored)
│   ├── raw-zone/
│   │   └── data_quality_reports/   # HTML profiling reports
│   └── refined-zone/
│       └── aqi_bucket_mapping.json # AQI Bucket label-to-integer mapping
├── docker/
│   └── docker-compose.yml      # Container setup (Spark, services)
├── docs/                       # Additional project documentation
├── notebooks/
│   ├── etl_pipeline.ipynb      # Spark-based data reading and processing
│   └── data_transformation.ipynb  # Cleaning, encoding and Parquet export
├── powerbi/                    # Power BI reports (optional)
├── scripts/
│   ├── extract.py              # Downloads dataset from Kaggle via kagglehub
│   ├── profile.py              # Generates ydata_profiling HTML reports
│   ├── transform.py            # Data cleaning and transformation logic
│   ├── load.py                 # Loads transformed data
│   ├── cargar_parquet.py       # Reads Parquet files into Spark temporary views
│   └── analysis.sql            # Analytical queries against Spark views
└── web/                        # Next.js interactive dashboard
```

---

## Prerequisites

| Requirement | Version |
|---|---|
| Python | 3.9+ |
| Apache Spark | 3.x |
| Node.js | 18+ |
| Kaggle API credentials | configured at `~/.kaggle/kaggle.json` |

Python dependencies:

```
kagglehub
pandas
ydata_profiling
pyspark
```

---

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/your-username/Designing-an-ETL-Process-for-Air-Quality-Data-in-India.git
cd Designing-an-ETL-Process-for-Air-Quality-Data-in-India
```

**2. Install Python dependencies**

```bash
pip install kagglehub pandas ydata_profiling pyspark
```

**3. Extract data from Kaggle**

```bash
python scripts/extract.py
```

This downloads the dataset and places all CSV files under `data/landing-zone/`.

**4. Generate data quality reports**

```bash
python scripts/profile.py
```

HTML reports are saved to `data/raw-zone/data_quality_reports/`.

**5. Run the transformation notebooks**

Open and execute in order:

1. `notebooks/etl_pipeline.ipynb` — initial Spark processing
2. `notebooks/data_transformation.ipynb` — encoding, cleaning, Parquet output

**6. Start the web dashboard**

```bash
cd web
npm install
npm run dev
```

The dashboard will be available at [http://localhost:3000](http://localhost:3000).

---

## Pipeline Stages

### Extract

`scripts/extract.py` uses the `kagglehub` library to authenticate against the Kaggle API and download the dataset. Files are moved to `data/landing-zone/` for downstream processing.

### Profile (Raw Zone)

`scripts/profile.py` iterates over every CSV in the landing zone and generates a comprehensive `ProfileReport` using `ydata_profiling`. Reports include descriptive statistics, missing value analysis, distributions, and correlation matrices. Output is written as HTML to `data/raw-zone/data_quality_reports/`.

### Transform (Refined Zone)

The transformation notebook (`notebooks/data_transformation.ipynb`) performs:

- Null handling and type coercion
- Encoding of the `AQI_Bucket` string column to a numeric label using the mapping defined in `data/refined-zone/aqi_bucket_mapping.json`
- Export of the cleaned DataFrame to Parquet format

### Load & Analyse

`scripts/cargar_parquet.py` reads Parquet files back into Apache Spark and registers them as temporary views. `scripts/analysis.sql` contains SQL queries executed against those views for exploratory analysis.

---

## Web Dashboard

The `web/` directory contains a Next.js 16 application that provides:

- **Dashboard** — interactive AQI charts (area chart with reference thresholds, donut distribution, per-city ranked bar chart, KPI cards with AQI gauge)
- **Reports** — embedded links to the ydata_profiling HTML reports generated in the raw zone
- **Docs** — structured documentation of the pipeline architecture and data schema

**Stack:** Next.js 16, React 19, Recharts, Tailwind CSS 4

To build for production:

```bash
cd web
npm run build
npm start
```

`npm run prebuild` automatically copies profiling reports from `data/raw-zone/data_quality_reports/` to `web/public/reports/` before each build.

---

## Data Schema

### city_day / city_hour

| Column | Type | Description |
|---|---|---|
| City | string | City name |
| Date | date | Measurement date |
| PM2.5 | float | Fine particulate matter (ug/m3) |
| PM10 | float | Coarse particulate matter (ug/m3) |
| NO | float | Nitric oxide (ug/m3) |
| NO2 | float | Nitrogen dioxide (ug/m3) |
| NOx | float | Nitrogen oxides (ppb) |
| NH3 | float | Ammonia (ug/m3) |
| CO | float | Carbon monoxide (mg/m3) |
| SO2 | float | Sulphur dioxide (ug/m3) |
| O3 | float | Ozone (ug/m3) |
| Benzene | float | Benzene (ug/m3) |
| Toluene | float | Toluene (ug/m3) |
| AQI | float | Air Quality Index |
| AQI\_Bucket | string | AQI category label |

### stations

| Column | Type | Description |
|---|---|---|
| StationId | string | Unique station identifier |
| StationName | string | Station name |
| City | string | City |
| State | string | State |
| Latitude | float | Geographic latitude |
| Longitude | float | Geographic longitude |

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

Dataset provided by Rohan Rao under its original Kaggle licence terms.

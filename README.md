# NBA Fantasy Predictor

A full-stack machine learning application that predicts a player's next-game fantasy points using historical NBA game logs.

## Features
- Player search with fuzzy matching
- Player dashboard with season averages
- Last 5 fantasy point trend
- Next-game fantasy point prediction
- Offline, reproducible ML pipeline (no paid APIs)

## Data
- Source: Kaggle NBA game logs
- Seasons covered: (fill in)
- Data is processed offline to ensure reproducibility and zero API cost

## Model
- Algorithm: RandomForestRegressor
- Target: FantasyPoints
- Features:
  - Rolling averages (last 3, last 5)
  - Season averages
  - Minutes trends
  - Home/away indicator
- Trained offline and loaded at API startup

## Fantasy Scoring
Describe the formula you use.

## Architecture
- Frontend: React + TypeScript + Vite
- Backend: FastAPI
- ML: scikit-learn
- Storage: CSV + Joblib

## Limitations
- No live NBA data
- Predictions are trend-based, not opponent-specific
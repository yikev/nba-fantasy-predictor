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
- Evaluation: ~5.68 fantasy points MAE on a held-out 20% test split.

## Architecture
- Frontend: React + TypeScript + Vite
- Backend: FastAPI
- ML: scikit-learn
- Storage: CSV + Joblib

## Limitations
- No live NBA data
- Predictions are trend-based, not opponent-specific
# 🏀 NBA Fantasy Predictor

An end-to-end, full-stack machine learning application that predicts an NBA player’s **next-game fantasy points** using historical game logs and an offline-trained model.

The app allows users to search for players, view season averages and recent performance, and see a prediction **along with model context and error metrics**.

---

## 🚀 Features

- 🔍 Player search with fuzzy matching
- 📊 Player dashboard with season averages
- 📈 Last 5 fantasy point trend
- 🤖 Next-game fantasy point prediction
- 🧠 Prediction context (recent form, minutes trend, home/playoff indicators)
- ⚡ Fully offline & reproducible ML pipeline (no paid APIs)

---

## 🧠 Data

- **Source:** Kaggle NBA historical game logs  
- Data is processed offline to ensure:
  - Reproducibility
  - Zero API cost
  - No rate limits or external dependencies

---

## 🤖 Model

- **Algorithm:** RandomForestRegressor (scikit-learn)
- **Target:** FantasyPoints
- **Features include:**
  - Rolling averages (last 3, last 5 games)
  - Season averages
  - Minutes trends and volatility
  - Home / away indicator
  - Playoff indicator
- **Evaluation:** ~**5.68 fantasy points MAE** on a held-out 20% test split
- Model is trained offline and loaded at API startup for fast inference

### Fantasy Points Formula

Fantasy points are calculated using a standard scoring system:

```
FP =
  points
+ 1.2 × rebounds
+ 1.5 × assists
+ 3.0 × steals
+ 3.0 × blocks
− 1.0 × turnovers
```

---

## 🧩 Architecture

### Frontend
- React
- TypeScript
- Vite

### Backend
- FastAPI
- Pandas

### Machine Learning
- scikit-learn
- Feature engineering with rolling windows
- Joblib for model persistence

### Storage
- CSV datasets
- Offline-trained model artifacts (not committed to source control)

---

## 🖥️ Application Flow

1. Search for an NBA player  
2. Select a player to open their profile  
3. View:
   - Season averages
   - Last 5 fantasy performances
   - Predicted fantasy points for the next game
   - Model context and MAE for transparency  

---

## ⚠️ Limitations

- No live NBA data (injuries, starting lineups, real-time matchups)
- Predictions are trend-based and historical
- Intended as a demonstration of applied ML + full-stack integration

---

## 🛠️ Running Locally

### Backend
```bash
cd backend
uvicorn main:app --reload
```

Runs at: `http://127.0.0.1:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Runs at: `http://localhost:5173`

---

## 👤 Author

**Kevin Yi**  
Computer Science graduate  
Focused on full-stack development and applied machine learning
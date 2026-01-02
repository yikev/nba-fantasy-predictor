from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="NBA Fantasy Predictor")

model = joblib.load("../fantasy_predictor_rf.joblib")

FEATURES = [
    "points",
    "reboundsTotal",
    "assists",
    "steals",
    "blocks",
    "turnovers",
    "fieldGoalsAttempted",
    "fieldGoalsMade",
    "threePointersAttempted",
    "threePointersMade",
    "freeThrowsAttempted",
    "freeThrowsMade",
    "numMinutes",
]

class PredictRequest(BaseModel):
    data: dict[str, float]

@app.post("/predict")
def predict(req: PredictRequest):
    missing = [f for f in FEATURES if f not in req.data]
    extra = [k for k in req.data.keys() if k not in FEATURES]

    if missing:
        raise HTTPException(status_code=400, detail={"missing": missing})
    if extra:
        raise HTTPException(status_code=400, detail={"extra": extra})

    x = np.array([[req.data[f] for f in FEATURES]], dtype=float)
    pred = model.predict(x)[0]
    return {"prediction": float(pred)}
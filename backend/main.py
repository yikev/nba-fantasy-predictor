from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="NBA Fantasy Predictor")

# Load model once at startup
model = joblib.load("../fantasy_predictor_rf.joblib")

class Features(BaseModel):
    features: list[float]

@app.post("/predict")
def predict(payload: Features):
    X = np.array(payload.features, dtype=float).reshape(1, -1)
    prediction = model.predict(X)[0]
    return {"prediction": float(prediction)}

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
from pathlib import Path

app = FastAPI(title="NBA Fantasy Predictor API")

# Allow your Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE = Path(__file__).resolve().parent

# Load datasets once at startup
player_stats = pd.read_csv(BASE / "data" / "PlayerStatistics.csv")
features_df = pd.read_csv(BASE / "data" / "features_dataset.csv")

# Normalize types
player_stats["gameDate"] = pd.to_datetime(player_stats["gameDate"], errors="coerce")
features_df["gameDate"] = pd.to_datetime(features_df["gameDate"], errors="coerce")

# Load next-game model
bundle = joblib.load(BASE / "fantasy_next_model.joblib")
model = bundle["model"]
feature_cols = bundle["feature_cols"]
MODEL_MAE = bundle.get("mae")  # might be missing if you didn't save it


def make_player_id(first: str, last: str, person_id: int) -> str:
    # stable slug that frontend can use if you want
    return f"{first}-{last}-{person_id}".lower().replace(" ", "-")


def _safe_float(v, default: float = 0.0) -> float:
    """Convert to float, treating NaN/None as default."""
    try:
        if v is None or (isinstance(v, float) and pd.isna(v)) or pd.isna(v):
            return float(default)
        return float(v)
    except Exception:
        return float(default)


@app.get("/players")
def search_players(query: str = Query(..., min_length=1)):
    q = query.strip().lower()

    # unique players from player_stats
    df = player_stats.copy()
    df["fullName"] = (df["firstName"].fillna("") + " " + df["lastName"].fillna("")).str.strip()

    # filter by name match
    hits = df[df["fullName"].str.lower().str.contains(q, na=False)]

    if hits.empty:
        return []

    # pick a recent row per personId to get current-ish team
    hits = hits.sort_values("gameDate").dropna(subset=["personId"])
    latest = hits.groupby("personId", as_index=False).tail(1)

    out = []
    for _, r in latest.iterrows():
        out.append(
            {
                "personId": int(r["personId"]),
                "fullName": r["fullName"],
                "team": str(r.get("playerteamName", "")),
            }
        )

    # limit results
    return out[:15]


@app.get("/players/{person_id}/summary")
def player_summary(person_id: int):
    df = player_stats[player_stats["personId"] == person_id].copy()
    if df.empty:
        raise HTTPException(status_code=404, detail="Player not found")

    df = df.dropna(subset=["gameDate"]).sort_values("gameDate")

    # Transparent formula (keep consistent with your README)
    def fantasy_points(row):
        return (
            row["points"]
            + 1.2 * row["reboundsTotal"]
            + 1.5 * row["assists"]
            + 3.0 * row["steals"]
            + 3.0 * row["blocks"]
            - 1.0 * row["turnovers"]
        )

    for col in ["points", "reboundsTotal", "assists", "steals", "blocks", "turnovers"]:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    df["FantasyPoints"] = df.apply(fantasy_points, axis=1)

    # Season averages
    avg_cols = [
        "points", "reboundsTotal", "assists", "steals", "blocks", "turnovers",
        "fieldGoalsAttempted", "fieldGoalsMade",
        "threePointersAttempted", "threePointersMade",
        "freeThrowsAttempted", "freeThrowsMade",
        "numMinutes"
    ]
    for col in avg_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    season_avg = {col: float(df[col].mean()) for col in avg_cols if col in df.columns}

    last5 = df.tail(5)
    last5_fp = [float(x) for x in last5["FantasyPoints"].tolist()]

    # Player identity
    first = str(df.iloc[-1]["firstName"])
    last = str(df.iloc[-1]["lastName"])
    full = (first + " " + last).strip()
    team = str(df.iloc[-1].get("playerteamName", ""))

    return {
        "personId": person_id,
        "fullName": full,
        "team": team,
        "seasonAverages": season_avg,
        "last5FantasyPoints": last5_fp,
    }


@app.get("/players/{person_id}/predict-next")
def predict_next(person_id: int):
    df = features_df[features_df["personId"] == person_id].copy()
    if df.empty:
        raise HTTPException(status_code=404, detail="No feature rows for this player")

    df = df.dropna(subset=["gameDate"]).sort_values("gameDate")
    latest = df.iloc[-1]

    # Build feature vector in correct order
    x = latest[feature_cols].to_frame().T

    pred = float(model.predict(x)[0])
    return {"personId": person_id, "predictedNextFantasyPoints": pred}


@app.get("/players/{person_id}/context")
def player_context(person_id: int):
    """
    Returns human-readable context using the same engineered features used during training.
    This is NOT model internals; it is explanatory metadata for the UI.
    """
    df = features_df[features_df["personId"] == person_id].copy()
    if df.empty:
        raise HTTPException(status_code=404, detail="No feature rows for this player")

    df = df.dropna(subset=["gameDate"]).sort_values("gameDate")
    latest = df.iloc[-1]

    # These columns exist in your features_dataset.csv (based on your earlier printout)
    last5_avg_fp = _safe_float(latest.get("FantasyPoints_avg_last_5"), 0.0)
    season_avg_fp = _safe_float(latest.get("FantasyPoints_season_avg"), 0.0)
    minutes_trend = _safe_float(latest.get("minutes_diff"), 0.0)
    home = bool(int(_safe_float(latest.get("home"), 0.0)))
    is_playoff = bool(int(_safe_float(latest.get("is_playoff"), 0.0)))

    mae = float(MODEL_MAE) if MODEL_MAE is not None else 5.68

    return {
        "personId": int(person_id),
        "last5_avg_fp": last5_avg_fp,
        "season_avg_fp": season_avg_fp,
        "minutes_trend": minutes_trend,
        "home": home,
        "is_playoff": is_playoff,
        "model_mae": mae,
    }
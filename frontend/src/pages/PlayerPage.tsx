import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getPlayerSummary,
  getPlayerPrediction,
  getPlayerPredictionContext,
  type PlayerPredictionContext,
  type PlayerSummary,
} from "../api";

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <div style={{ opacity: 0.85, color: "#333" }}>{label}</div>
      <div style={{ fontWeight: 600, color: "#111" }}>{value}</div>
    </div>
  );
}

function fmt(n: number) {
  return Number.isFinite(n) ? n.toFixed(1) : "-";
}

export default function PlayerPage() {
  const { id } = useParams(); // this is personId now
  const personId = Number(id);

  const [summary, setSummary] = useState<PlayerSummary | null>(null);
  const [pred, setPred] = useState<number | null>(null);
  const [context, setContext] = useState<PlayerPredictionContext | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(personId)) {
      setError("Invalid player id");
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // reset for new player loads
        setSummary(null);
        setPred(null);
        setContext(null);

        // fetch all in parallel
        const [s, p, c] = await Promise.all([
          getPlayerSummary(personId),
          getPlayerPrediction(personId),
          getPlayerPredictionContext(personId),
        ]);

        if (cancelled) return;

        setSummary(s);
        setPred(p.predictedNextFantasyPoints);
        setContext(c);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? "Failed to load player");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [personId]);

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
        <Link to="/" style={{ color: "#8ab4ff" }}>
          ← Back to search
        </Link>

        <div style={{ marginTop: 14 }}>
          <div style={{ height: 34, width: 320, background: "#2a2a2a", borderRadius: 10 }} />
          <div style={{ marginTop: 10, height: 16, width: 140, background: "#2a2a2a", borderRadius: 10 }} />
        </div>

        <div style={{ marginTop: 18, height: 110, background: "white", borderRadius: 14, border: "1px solid #e5e5e5" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
          <div style={{ height: 430, background: "white", borderRadius: 14, border: "1px solid #e5e5e5" }} />
          <div style={{ height: 430, background: "white", borderRadius: 14, border: "1px solid #e5e5e5" }} />
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
        <Link to="/" style={{ color: "#8ab4ff" }}>
          ← Back to search
        </Link>
        <div style={{ marginTop: 16, color: "#ff7b7b" }}>{error ?? "Player not found"}</div>
      </div>
    );
  }

  const avg = summary.seasonAverages;

  const last5Avg =
    summary.last5FantasyPoints.length > 0
      ? summary.last5FantasyPoints.reduce((a, b) => a + b, 0) / summary.last5FantasyPoints.length
      : 0;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <Link to="/" style={{ color: "#8ab4ff" }}>
        ← Back to search
      </Link>

      <div style={{ marginTop: 14 }}>
        <h1 style={{ marginBottom: 6 }}>{summary.fullName}</h1>
        <div style={{ opacity: 0.8 }}>{summary.team ?? ""}</div>
      </div>

      <div
        style={{
          marginTop: 18,
          padding: 18,
          border: "1px solid #e5e5e5",
          borderRadius: 14,
          background: "white",
          color: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 13, opacity: 0.75 }}>Predicted next game</div>
          <div style={{ fontSize: 36, fontWeight: 800, marginTop: 6 }}>{pred == null ? "-" : fmt(pred)}</div>
          <div style={{ opacity: 0.75 }}>Fantasy points</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, opacity: 0.75 }}>Last 5 avg</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{fmt(last5Avg)}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Fantasy points</div>
        </div>
      </div>

      {/* NEW: Prediction context card */}
      {context && (
        <div
          style={{
            marginTop: 18,
            padding: 16,
            border: "1px solid #e5e5e5",
            borderRadius: 14,
            background: "white",
            color: "#111",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 10 }}>Prediction context</h3>

          <StatRow label="Last 5 avg FP" value={context.last5_avg_fp ?? 0} />
          <StatRow label="Season avg FP" value={context.season_avg_fp ?? 0} />
          <StatRow label="Minutes trend" value={context.minutes_trend ?? 0} />

          <div style={{ marginTop: 10, opacity: 0.8, fontSize: 13 }}>
            Home game: <b>{context.home ? "Yes" : "No"}</b> • Playoffs: <b>{context.is_playoff ? "Yes" : "No"}</b>
            {context.model_mae != null && (
              <>
                {" "}
                • Model MAE: <b>{Number(context.model_mae).toFixed(2)}</b>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
        <div style={{ padding: 16, border: "1px solid #e5e5e5", borderRadius: 14, background: "white", color: "#111" }}>
          <h3 style={{ marginTop: 0, marginBottom: 10 }}>Season averages</h3>
          <StatRow label="Points" value={avg.points ?? 0} />
          <StatRow label="Rebounds" value={avg.reboundsTotal ?? 0} />
          <StatRow label="Assists" value={avg.assists ?? 0} />
          <StatRow label="Steals" value={avg.steals ?? 0} />
          <StatRow label="Blocks" value={avg.blocks ?? 0} />
          <StatRow label="Turnovers" value={avg.turnovers ?? 0} />
          <StatRow label="FGA" value={avg.fieldGoalsAttempted ?? 0} />
          <StatRow label="FGM" value={avg.fieldGoalsMade ?? 0} />
          <StatRow label="3PA" value={avg.threePointersAttempted ?? 0} />
          <StatRow label="3PM" value={avg.threePointersMade ?? 0} />
          <StatRow label="FTA" value={avg.freeThrowsAttempted ?? 0} />
          <StatRow label="FTM" value={avg.freeThrowsMade ?? 0} />
          <StatRow label="Minutes" value={avg.numMinutes ?? 0} />
        </div>

        <div style={{ padding: 16, border: "1px solid #e5e5e5", borderRadius: 14, background: "white", color: "#111" }}>
          <h3 style={{ marginTop: 0, marginBottom: 10 }}>Last 5 fantasy points</h3>

          <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
            {summary.last5FantasyPoints.map((v, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "#f6f6f6",
                  color: "#111",
                }}
              >
                <div style={{ opacity: 0.8 }}>Game {5 - idx}</div>
                <div style={{ fontWeight: 700 }}>{fmt(v)}</div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 14, opacity: 0.75, fontSize: 13 }}>
            Powered by offline Kaggle game logs and a trained model. No live API dependency.
          </p>
        </div>
      </div>
    </div>
  );
}
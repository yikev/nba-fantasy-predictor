import { Link, useParams } from "react-router-dom";
import { MOCK_PLAYERS } from "../data/mockPlayers";

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

export default function PlayerPage() {
  const { id } = useParams();
  const player = MOCK_PLAYERS.find((p) => p.id === id);

  if (!player) {
    return (
      <div
        style={{
          maxWidth: 900,
          margin: "40px auto",
          padding: 16,
          fontFamily: "system-ui",
        }}
      >
        <Link to="/" style={{ color: "#8ab4ff" }}>
          ← Back to search
        </Link>
        <h2 style={{ marginTop: 12 }}>Player not found</h2>
      </div>
    );
  }

  const avg = player.seasonAverages;
  const last5Avg =
    player.last5FantasyPoints.reduce((a, b) => a + b, 0) /
    player.last5FantasyPoints.length;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 16,
        fontFamily: "system-ui",
      }}
    >
      <Link to="/" style={{ color: "#8ab4ff" }}>
        ← Back to search
      </Link>

      <div style={{ marginTop: 14 }}>
        <h1 style={{ marginBottom: 6 }}>{player.fullName}</h1>
        <div style={{ opacity: 0.8 }}>
          {player.team} - {player.position}
        </div>
      </div>

      {/* Prediction card */}
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
          <div style={{ fontSize: 36, fontWeight: 800, marginTop: 6 }}>
            {player.predictedNextFantasyPoints.toFixed(1)}
          </div>
          <div style={{ opacity: 0.75 }}>Fantasy points</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, opacity: 0.75 }}>Last 5 avg</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            {last5Avg.toFixed(1)}
          </div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Fantasy points</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 18,
        }}
      >
        {/* Season averages */}
        <div
          style={{
            padding: 16,
            border: "1px solid #e5e5e5",
            borderRadius: 14,
            background: "white",
            color: "#111",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 10 }}>Season averages</h3>
          <StatRow label="Points" value={avg.points} />
          <StatRow label="Rebounds" value={avg.reboundsTotal} />
          <StatRow label="Assists" value={avg.assists} />
          <StatRow label="Steals" value={avg.steals} />
          <StatRow label="Blocks" value={avg.blocks} />
          <StatRow label="Turnovers" value={avg.turnovers} />
          <StatRow label="FGA" value={avg.fieldGoalsAttempted} />
          <StatRow label="FGM" value={avg.fieldGoalsMade} />
          <StatRow label="3PA" value={avg.threePointersAttempted} />
          <StatRow label="3PM" value={avg.threePointersMade} />
          <StatRow label="FTA" value={avg.freeThrowsAttempted} />
          <StatRow label="FTM" value={avg.freeThrowsMade} />
          <StatRow label="Minutes" value={avg.numMinutes} />
        </div>

        {/* Last 5 fantasy points */}
        <div
          style={{
            padding: 16,
            border: "1px solid #e5e5e5",
            borderRadius: 14,
            background: "white",
            color: "#111",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 10 }}>
            Last 5 fantasy points
          </h3>

          <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
            {player.last5FantasyPoints.map((v, idx) => (
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
                <div style={{ fontWeight: 700 }}>{v.toFixed(1)}</div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 14, opacity: 0.75, fontSize: 13 }}>
            Next step: replace mock values with real backend data from Kaggle
            game logs and model inference.
          </p>
        </div>
      </div>
    </div>
  );
}
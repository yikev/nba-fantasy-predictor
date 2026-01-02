import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_PLAYERS } from "../data/mockPlayers";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MOCK_PLAYERS.filter((p) => p.fullName.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 8 }}>NBA Fantasy Predictor</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Search a player to view season averages, last 5 fantasy points, and next game prediction.
      </p>

      <div style={{ marginTop: 16 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search NBA player (ex: Jokic, Shai, Curry)"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />
      </div>

      {results.length > 0 && (
        <div
          style={{
            marginTop: 12,
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/players/${p.id}`)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                border: "none",
                borderBottom: "1px solid #eee",
                background: "white",
                color: "#111",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 600 }}>{p.fullName}</div>
              <div style={{ fontSize: 13, opacity: 0.75 }}>
                {p.team} - {p.position}
              </div>
            </button>
          ))}
        </div>
      )}

      {query.trim() !== "" && results.length === 0 && (
        <div style={{ marginTop: 12, opacity: 0.75 }}>No matches.</div>
      )}
    </div>
  );
}
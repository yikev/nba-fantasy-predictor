import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPlayers, type PlayerSearchResult } from "../api";

export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchPlayers(q);
        setResults(data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to search");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [query]);

  return (
    <div style={{ maxWidth: 900, margin: "60px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 6 }}>NBA Fantasy Predictor</h1>
      <p style={{ opacity: 0.75, marginTop: 0 }}>
        Search a player to view season averages, last 5 fantasy points, and next game prediction.
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a player..."
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "1px solid #444",
          background: "#1f1f1f",
          color: "white",
        }}
      />

      <div style={{ marginTop: 10 }}>
        {loading && <div style={{ opacity: 0.75 }}>Searching...</div>}
        {error && <div style={{ color: "#ff7b7b" }}>{error}</div>}
      </div>

      {results.length > 0 && (
        <div
          style={{
            marginTop: 10,
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid #e5e5e5",
            background: "white",
            color: "#111",
          }}
        >
          {results.map((p) => (
            <button
              key={p.personId}
              onClick={() => navigate(`/players/${p.personId}`)}
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
              <div style={{ fontWeight: 700 }}>{p.fullName}</div>
              <div style={{ fontSize: 13, opacity: 0.75, color: "#333" }}>{p.team ?? ""}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
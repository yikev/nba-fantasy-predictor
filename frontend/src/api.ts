const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export type PlayerSearchResult = {
  personId: number;
  fullName: string;
  team?: string;
};

export type PlayerSummary = {
  personId: number;
  fullName: string;
  team?: string;
  seasonAverages: Record<string, number>;
  last5FantasyPoints: number[];
};

export async function searchPlayers(query: string): Promise<PlayerSearchResult[]> {
  const url = `${API_BASE}/players?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}

export async function getPlayerSummary(personId: number): Promise<PlayerSummary> {
  const res = await fetch(`${API_BASE}/players/${personId}/summary`);
  if (!res.ok) throw new Error(`Summary failed: ${res.status}`);
  return res.json();
}

export async function getPlayerPrediction(personId: number): Promise<{ predictedNextFantasyPoints: number }> {
  const res = await fetch(`${API_BASE}/players/${personId}/predict-next`);
  if (!res.ok) throw new Error(`Predict failed: ${res.status}`);
  return res.json();
}
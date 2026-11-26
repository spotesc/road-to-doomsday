const BASE = "https://api.themoviedb.org/3";

export function hasKey() {
  return Boolean((process.env.TMDB_API_KEY || "").trim());
}

export async function tmdb(path, params = {}) {
  const key = (process.env.TMDB_API_KEY || "").trim();
  if (!key) throw new Error("TMDB_API_KEY is missing");
  const query = new URLSearchParams({ language: "en-US", ...params });
  const headers = { accept: "application/json" };
  if (key.startsWith("ey")) headers.authorization = `Bearer ${key}`;
  else query.set("api_key", key);
  const res = await fetch(`${BASE}${path}?${query}`, { headers });
  if (!res.ok) throw new Error(`TMDB ${res.status} on ${path}`);
  return res.json();
}

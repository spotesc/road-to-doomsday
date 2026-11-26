import { SECTIONS, FINALE } from "../data/titles.js";
import { tmdb, hasKey } from "../lib/tmdb.js";

const shows = new Map();

function trailerKey(videos) {
  const list = (videos?.results || []).filter((v) => v.site === "YouTube");
  const pick =
    list.find((v) => v.type === "Trailer" && v.official) ||
    list.find((v) => v.type === "Trailer") ||
    list.find((v) => v.type === "Teaser");
  return pick ? pick.key : null;
}

function show(id) {
  if (!shows.has(id)) shows.set(id, tmdb(`/tv/${id}`, { append_to_response: "videos" }));
  return shows.get(id);
}

async function movie(id) {
  const m = await tmdb(`/movie/${id}`, { append_to_response: "videos" });
  return {
    name: m.title,
    poster: m.poster_path,
    backdrop: m.backdrop_path,
    tagline: m.tagline || "",
    overview: m.overview || "",
    runtime: m.runtime || null,
    released: m.release_date || null,
    rating: m.vote_count > 20 ? Math.round(m.vote_average * 10) / 10 : null,
    genres: (m.genres || []).map((g) => g.name),
    trailer: trailerKey(m.videos),
    link: `https://www.themoviedb.org/movie/${id}`,
  };
}

async function season(id, number) {
  const [s, season] = await Promise.all([
    show(id),
    tmdb(`/tv/${id}/season/${number}`, { append_to_response: "videos" }),
  ]);
  const episodes = season.episodes || [];
  const runtime = episodes.reduce((sum, e) => sum + (e.runtime || 0), 0);
  const firstStill = episodes.find((e) => e.still_path)?.still_path || null;
  return {
    name: s.name,
    poster: season.poster_path || s.poster_path,
    backdrop: number > 1 && firstStill ? firstStill : s.backdrop_path || firstStill,
    tagline: s.tagline || "",
    overview: season.overview || s.overview || "",
    runtime: runtime || null,
    episodes: episodes.length || null,
    released: season.air_date || null,
    rating: season.vote_average ? Math.round(season.vote_average * 10) / 10 : s.vote_count > 20 ? Math.round(s.vote_average * 10) / 10 : null,
    genres: (s.genres || []).map((g) => g.name),
    trailer: trailerKey(season.videos) || trailerKey(s.videos),
    link: `https://www.themoviedb.org/tv/${id}/season/${number}`,
  };
}

function lookup(ref) {
  const [type, id, number] = ref.split(":");
  return type === "movie" ? movie(id) : season(id, Number(number || 1));
}

async function inBatches(list, size, fn) {
  const out = [];
  for (let i = 0; i < list.length; i += size) {
    out.push(...(await Promise.all(list.slice(i, i + size).map(fn))));
  }
  return out;
}

export async function GET() {
  try {
    if (!hasKey()) throw new Error("TMDB_API_KEY is missing");
    const wanted = [...SECTIONS.flatMap((s) => s.items), FINALE].filter((t) => t.tmdb);
    const results = await inBatches(wanted, 10, async (t) => {
      try {
        return [t.id, await lookup(t.tmdb)];
      } catch {
        return [t.id, null];
      }
    });
    const titles = Object.fromEntries(results.filter(([, info]) => info));
    return Response.json(
      { updated: new Date().toISOString(), titles },
      { headers: { "cache-control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800" } }
    );
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}

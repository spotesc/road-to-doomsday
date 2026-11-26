import "server-only";
import { cacheLife } from "next/cache";
import { FINALE, SECTIONS } from "@/data/titles";

export interface TitleDetails {
  name: string;
  poster: string | null;
  backdrop: string | null;
  tagline: string;
  overview: string;
  runtime: number | null;
  episodes: number | null;
  released: string | null;
  rating: number | null;
  genres: string[];
  trailer: string | null;
  link: string;
}

export type DetailsMap = Record<string, TitleDetails>;

interface Video {
  site: string;
  type: string;
  key: string;
  official?: boolean;
}

interface Genre {
  name: string;
}

interface Movie {
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  tagline?: string;
  overview?: string;
  runtime?: number;
  release_date?: string;
  vote_average: number;
  vote_count: number;
  genres?: Genre[];
  videos?: { results: Video[] };
}

interface Show {
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  tagline?: string;
  overview?: string;
  vote_average: number;
  vote_count: number;
  genres?: Genre[];
  videos?: { results: Video[] };
}

interface Season {
  poster_path: string | null;
  overview?: string;
  air_date?: string;
  vote_average?: number;
  episodes?: { runtime: number | null; still_path: string | null }[];
  videos?: { results: Video[] };
}

interface ReleaseDates {
  results: { iso_3166_1: string; release_dates: { release_date: string; type: number }[] }[];
}

async function tmdb<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const key = (process.env.TMDB_API_KEY ?? "").trim();
  if (!key) throw new Error("TMDB_API_KEY is missing");
  const query = new URLSearchParams({ language: "en-US", ...params });
  const headers: HeadersInit = { accept: "application/json" };
  if (key.startsWith("ey")) headers.authorization = `Bearer ${key}`;
  else query.set("api_key", key);
  const res = await fetch(`https://api.themoviedb.org/3${path}?${query}`, { headers });
  if (!res.ok) throw new Error(`TMDB ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

const round = (n: number) => Math.round(n * 10) / 10;

function trailerKey(videos?: { results: Video[] }) {
  const list = (videos?.results ?? []).filter((v) => v.site === "YouTube");
  const pick =
    list.find((v) => v.type === "Trailer" && v.official) ??
    list.find((v) => v.type === "Trailer") ??
    list.find((v) => v.type === "Teaser");
  return pick?.key ?? null;
}

async function movie(id: string): Promise<TitleDetails> {
  const m = await tmdb<Movie>(`/movie/${id}`, { append_to_response: "videos" });
  return {
    name: m.title,
    poster: m.poster_path,
    backdrop: m.backdrop_path,
    tagline: m.tagline ?? "",
    overview: m.overview ?? "",
    runtime: m.runtime || null,
    episodes: null,
    released: m.release_date || null,
    rating: m.vote_count > 20 ? round(m.vote_average) : null,
    genres: (m.genres ?? []).map((g) => g.name),
    trailer: trailerKey(m.videos),
    link: `https://www.themoviedb.org/movie/${id}`,
  };
}

async function season(id: string, number: number, shows: Map<string, Promise<Show>>): Promise<TitleDetails> {
  if (!shows.has(id)) shows.set(id, tmdb<Show>(`/tv/${id}`, { append_to_response: "videos" }));
  const [show, s] = await Promise.all([
    shows.get(id)!,
    tmdb<Season>(`/tv/${id}/season/${number}`, { append_to_response: "videos" }),
  ]);
  const episodes = s.episodes ?? [];
  const runtime = episodes.reduce((sum, e) => sum + (e.runtime ?? 0), 0);
  const still = episodes.find((e) => e.still_path)?.still_path ?? null;
  return {
    name: show.name,
    poster: s.poster_path ?? show.poster_path,
    backdrop: number > 1 && still ? still : (show.backdrop_path ?? still),
    tagline: show.tagline ?? "",
    overview: s.overview || show.overview || "",
    runtime: runtime || null,
    episodes: episodes.length || null,
    released: s.air_date ?? null,
    rating: s.vote_average ? round(s.vote_average) : show.vote_count > 20 ? round(show.vote_average) : null,
    genres: (show.genres ?? []).map((g) => g.name),
    trailer: trailerKey(s.videos) ?? trailerKey(show.videos),
    link: `https://www.themoviedb.org/tv/${id}/season/${number}`,
  };
}

export async function getDetails(): Promise<DetailsMap> {
  "use cache";
  const wanted = [...SECTIONS.flatMap((s) => s.items), FINALE].filter(
    (t): t is typeof t & { tmdb: string } => Boolean(t.tmdb)
  );
  const shows = new Map<string, Promise<Show>>();
  const details: DetailsMap = {};

  try {
    for (let i = 0; i < wanted.length; i += 10) {
      const batch = await Promise.all(
        wanted.slice(i, i + 10).map(async (t) => {
          const [type, id, number] = t.tmdb.split(":");
          try {
            const info = type === "movie" ? await movie(id) : await season(id, Number(number ?? 1), shows);
            return [t.id, info] as const;
          } catch {
            return null;
          }
        })
      );
      for (const entry of batch) if (entry) details[entry[0]] = entry[1];
    }
  } catch {}

  if (Object.keys(details).length === 0) {
    cacheLife("minutes");
    return {};
  }
  cacheLife("days");
  return details;
}

export async function getReleaseDates(): Promise<Record<string, string>> {
  "use cache";
  try {
    const id = FINALE.tmdb.split(":")[1];
    const data = await tmdb<ReleaseDates>(`/movie/${id}/release_dates`);
    const dates: Record<string, string> = {};
    for (const entry of data.results) {
      const first = (type: number) =>
        entry.release_dates
          .filter((d) => d.type === type)
          .map((d) => d.release_date.slice(0, 10))
          .sort()[0];
      const date = first(3) ?? first(2);
      if (date) dates[entry.iso_3166_1] = date;
    }
    cacheLife("hours");
    return dates;
  } catch {
    cacheLife("minutes");
    return {};
  }
}

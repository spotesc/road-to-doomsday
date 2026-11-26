import { FINALE, RELEASE } from "../data/titles.js";
import { tmdb } from "../lib/tmdb.js";

const SIX_HOURS = 6 * 60 * 60 * 1000;
const SAME_RELEASE_AS = { IE: "GB" };
let cache = { at: 0, dates: null };

async function releaseDates() {
  if (cache.dates && Date.now() - cache.at < SIX_HOURS) return cache.dates;
  const id = FINALE.tmdb.split(":")[1];
  const data = await tmdb(`/movie/${id}/release_dates`);
  const dates = {};
  for (const entry of data.results || []) {
    const of = (type) =>
      entry.release_dates
        .filter((d) => d.type === type)
        .map((d) => d.release_date.slice(0, 10))
        .sort()[0];
    const date = of(3) || of(2);
    if (date) dates[entry.iso_3166_1] = date;
  }
  cache = { at: Date.now(), dates };
  return dates;
}

export async function GET(request) {
  const url = new URL(request.url);
  const asked = (url.searchParams.get("country") || request.headers.get("x-vercel-ip-country") || "").toUpperCase();

  let dates = {};
  try {
    dates = await releaseDates();
  } catch {}

  const date = /^[A-Z]{2}$/.test(asked) ? dates[asked] || dates[SAME_RELEASE_AS[asked]] : null;
  return Response.json(
    {
      country: date ? asked : null,
      date: date || dates.US || RELEASE,
    },
    { headers: { "cache-control": "private, max-age=3600" } }
  );
}

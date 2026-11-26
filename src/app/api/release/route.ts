import type { NextRequest } from "next/server";
import { RELEASE } from "@/data/titles";
import { getReleaseDates } from "@/lib/tmdb";

const SAME_RELEASE_AS: Record<string, string> = { IE: "GB" };

export async function GET(request: NextRequest) {
  const asked = (
    request.nextUrl.searchParams.get("country") ??
    request.headers.get("x-vercel-ip-country") ??
    ""
  ).toUpperCase();

  const dates = await getReleaseDates();
  const date = /^[A-Z]{2}$/.test(asked) ? (dates[asked] ?? dates[SAME_RELEASE_AS[asked]]) : undefined;

  return Response.json(
    { country: date ? asked : null, date: date ?? dates.US ?? RELEASE },
    { headers: { "cache-control": "private, max-age=3600" } }
  );
}

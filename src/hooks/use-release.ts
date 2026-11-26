"use client";

import { useEffect, useMemo } from "react";
import { RELEASE } from "@/data/titles";
import { useStored } from "@/hooks/use-stored";

export interface Release {
  date: string;
  country: string | null;
}

export interface LocalRelease extends Release {
  at: Date;
  short: string;
  long: string;
  dayMonth: string;
  region: string | null;
}

const isDate = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

function describe(release: Release): LocalRelease {
  const [y, m, d] = release.date.split("-");
  const at = new Date(Number(y), Number(m) - 1, Number(d));
  const monthFirst = release.country ? release.country === "US" : navigator.language === "en-US";
  let region: string | null = null;
  if (release.country) {
    try {
      region = new Intl.DisplayNames([navigator.language || "en"], { type: "region" }).of(release.country) ?? null;
    } catch {
      region = release.country;
    }
  }
  return {
    ...release,
    at,
    short: `${monthFirst ? `${m}.${d}` : `${d}.${m}`}.${y.slice(2)}`,
    long: at.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }),
    dayMonth: at.toLocaleDateString(undefined, { day: "numeric", month: "long" }),
    region,
  };
}

export function useRelease(): LocalRelease | null {
  const [saved, save] = useStored<Release | null>("road-to-doomsday:release", null);

  useEffect(() => {
    let done = false;
    const fallback = window.setTimeout(() => {
      if (!done && !saved) save({ date: RELEASE, country: null });
    }, 3000);
    const override = new URLSearchParams(window.location.search).get("country");
    fetch(`/api/release${override ? `?country=${encodeURIComponent(override)}` : ""}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: Release) => {
        done = true;
        if (isDate(data.date)) save({ date: data.date, country: data.country ?? null });
      })
      .catch(() => {
        done = true;
        if (!saved) save({ date: RELEASE, country: null });
      })
      .finally(() => window.clearTimeout(fallback));
    return () => window.clearTimeout(fallback);
    // runs once per visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(() => (saved && isDate(saved.date) ? describe(saved) : null), [saved]);
}

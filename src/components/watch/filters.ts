import type { StoryTitle } from "@/data/titles";

export type FilterKey = "all" | "ess" | "picks" | "films" | "series";
export type ViewKey = "list" | "grid";

export const FILTERS: { key: FilterKey; label: string; test: (t: StoryTitle) => boolean }[] = [
  { key: "all", label: "Everything", test: () => true },
  { key: "ess", label: "Essentials", test: (t) => t.tier === "ess" },
  { key: "picks", label: "Disney+ picks", test: (t) => Boolean(t.pick) },
  { key: "films", label: "Films", test: (t) => t.kind === "film" || t.kind === "special" },
  { key: "series", label: "Series", test: (t) => t.kind === "series" || t.kind === "animated" },
];

export const filterTest = (key: FilterKey) => (FILTERS.find((f) => f.key === key) ?? FILTERS[0]).test;

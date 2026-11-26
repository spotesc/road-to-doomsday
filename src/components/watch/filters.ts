import type { StoryTitle } from "@/data/titles";

export type RouteKey = "essentials" | "core" | "everything";
export type KindKey = "all" | "films" | "series";
export type ViewKey = "list" | "grid";

export interface Route {
  key: RouteKey;
  numeral: string;
  label: string;
  blurb: string;
  test: (t: StoryTitle) => boolean;
}

export const ROUTES: Route[] = [
  {
    key: "essentials",
    numeral: "I",
    label: "Essentials",
    blurb: "The fastest road. Only what Doomsday needs.",
    test: (t) => t.tier === "ess",
  },
  {
    key: "core",
    numeral: "II",
    label: "The Core Story",
    blurb: "The essentials, plus the stories that deepen them.",
    test: (t) => t.tier !== "opt",
  },
  {
    key: "everything",
    numeral: "III",
    label: "Everything",
    blurb: "Every film and series. No stone unturned.",
    test: () => true,
  },
];

export const KIND_FILTERS: { key: KindKey; label: string; test: (t: StoryTitle) => boolean }[] = [
  { key: "all", label: "All", test: () => true },
  { key: "films", label: "Films", test: (t) => t.kind === "film" || t.kind === "special" },
  { key: "series", label: "Series", test: (t) => t.kind === "series" || t.kind === "animated" },
];

export const routeOf = (key: RouteKey) => ROUTES.find((r) => r.key === key) ?? ROUTES[2];
export const kindOf = (key: KindKey) => KIND_FILTERS.find((k) => k.key === key) ?? KIND_FILTERS[0];

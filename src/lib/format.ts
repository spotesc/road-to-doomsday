import type { Kind, StoryTitle } from "@/data/titles";
import type { TitleDetails } from "@/lib/tmdb";

export const KINDS: Record<Kind, string> = {
  film: "Film",
  series: "Series",
  special: "Special",
  animated: "Animated",
};

export const pad = (n: number) => String(n).padStart(2, "0");

export function runtimeText(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export const isShow = (t: StoryTitle) => t.kind === "series" || t.kind === "animated";

export const nameOf = (t: StoryTitle, d?: TitleDetails) => d?.name || t.title;

export const fullName = (t: StoryTitle, d?: TitleDetails) =>
  t.season ? `${nameOf(t, d)} (Season ${t.season})` : nameOf(t, d);

export const minsOf = (t: StoryTitle, d?: TitleDetails) => d?.runtime || t.mins || 0;

export const epsOf = (t: StoryTitle, d?: TitleDetails) => d?.episodes || t.eps || 0;

export function lengthText(t: StoryTitle, d?: TitleDetails) {
  const eps = epsOf(t, d);
  if (eps) return `${eps} eps`;
  const mins = minsOf(t, d);
  return mins ? runtimeText(mins) : "";
}

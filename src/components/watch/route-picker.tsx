"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { StoryTitle } from "@/data/titles";
import { minsOf } from "@/lib/format";
import type { DetailsMap } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { ROUTES, type RouteKey } from "./filters";

interface Props {
  route: RouteKey;
  titles: StoryTitle[];
  watched: Set<string>;
  details: DetailsMap;
  onRoute: (route: RouteKey) => void;
}

export function RoutePicker({ route, titles, watched, details, onRoute }: Props) {
  return (
    <motion.section
      aria-labelledby="route-title"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-[9px] text-steel">Choose your route</p>
          <h2 id="route-title" className="poster-type mt-2 text-[28px] leading-none sm:text-[38px]">
            <span className="text-metal">How deep do you go?</span>
          </h2>
        </div>
        <p className="max-w-xs text-[12.5px] leading-relaxed text-muted-foreground">
          Your route sets the list, your progress and what comes up next. Switch any time; ticks are kept.
        </p>
      </div>

      <ToggleGroup
        type="single"
        value={route}
        onValueChange={(v) => v && onRoute(v as RouteKey)}
        aria-label="Route"
        className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {ROUTES.map((r) => {
          const list = titles.filter(r.test);
          const seen = list.filter((t) => watched.has(t.id)).length;
          const hours = Math.round(list.reduce((sum, t) => sum + minsOf(t, details[t.id]), 0) / 60);
          const active = r.key === route;
          return (
            <ToggleGroupItem
              key={r.key}
              value={r.key}
              aria-label={`${r.label}: ${list.length} titles, about ${hours} hours`}
              className={cn(
                "panel group relative isolate flex h-auto min-w-0 flex-col items-stretch justify-start gap-0 overflow-hidden rounded-2xl bg-charcoal/60 px-5 py-4 text-left whitespace-normal transition-[border-color,box-shadow,background,transform] duration-500 first:rounded-2xl last:rounded-2xl hover:-translate-y-px hover:border-silver/25 hover:bg-charcoal/80 data-[state=on]:bg-charcoal/80 sm:px-6 sm:py-6",
                active &&
                  "border-silver/40 shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_0_0_1px_rgb(143_191_170/0.25),0_30px_60px_-30px_rgb(60_130_105/0.55)]"
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -top-16 left-1/2 -z-10 h-32 w-3/4 -translate-x-1/2 rounded-full bg-doom blur-3xl transition-opacity duration-700",
                  active ? "opacity-90" : "opacity-0"
                )}
              />
              <span className="flex items-center justify-between">
                <span className="eyebrow text-[8.5px] text-steel">Route {r.numeral}</span>
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-full border transition-[background,border-color] duration-500",
                    active ? "border-mint/60 bg-forest text-soft" : "border-white/15 text-transparent"
                  )}
                >
                  <Check className="size-3.5 stroke-[3]" />
                </span>
              </span>
              <span className="poster-type mt-3 block text-[30px] leading-none sm:text-[34px]">
                <span className={active ? "text-metal" : "text-silver/70"}>{r.label}</span>
              </span>
              <span className="mt-2 block text-[13px] leading-snug font-normal text-muted-foreground">{r.blurb}</span>
              <span className="mt-3 flex items-baseline gap-2 font-mono text-[11px] tracking-[0.12em] text-silver uppercase sm:mt-5">
                <span className="text-[20px] font-light tracking-normal text-soft tabular-nums">{list.length}</span>
                titles
                <span className="text-faint">/</span>
                <span className="tabular-nums">~{hours}h</span>
                <span className="text-faint sm:hidden">/</span>
                <span className="tabular-nums text-steel sm:hidden">{seen} watched</span>
              </span>
              <span className="mt-4 hidden h-[3px] overflow-hidden rounded-full bg-white/[0.06] sm:block">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-forest to-mint transition-[width] duration-700"
                  style={{ width: `${list.length ? (seen / list.length) * 100 : 0}%` }}
                />
              </span>
              <span className="mt-2 hidden font-mono text-[9.5px] tracking-[0.16em] text-steel uppercase sm:block">
                {seen} / {list.length} watched
              </span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </motion.section>
  );
}

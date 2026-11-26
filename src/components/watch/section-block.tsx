"use client";

import { AnimatePresence } from "motion/react";
import type { Section, StoryTitle } from "@/data/titles";
import type { DetailsMap } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import type { ViewKey } from "./filters";
import { TitleCard, TitleRow } from "./title-item";
import { BackdropImage } from "./tmdb-image";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

interface Props {
  section: Section;
  index: number;
  matching: StoryTitle[];
  visible: StoryTitle[];
  watched: Set<string>;
  details: DetailsMap;
  view: ViewKey;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
}

export function SectionBlock({ section, index, matching, visible, watched, details, view, onToggle, onOpen }: Props) {
  const seen = matching.filter((t) => watched.has(t.id)).length;
  const complete = matching.length > 0 && seen === matching.length;
  const Item = view === "grid" ? TitleCard : TitleRow;

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="mt-14 sm:mt-20">
      <header
        className={cn(
          "letterbox relative isolate flex min-h-[230px] items-end overflow-hidden rounded-3xl border border-white/[0.06] sm:min-h-[300px]",
          complete && "border-jade/30"
        )}
      >
        <div className="absolute inset-0 -z-10 opacity-70">
          <BackdropImage path={details[section.cover]?.backdrop} sizes="(max-width: 1024px) 100vw, 1024px" className="object-[center_30%]" />
        </div>
        <div className="chapter-veil absolute inset-0 -z-10" />
        <span
          aria-hidden
          className="pointer-events-none absolute top-5 right-5 font-display text-[96px] leading-none font-bold text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.16)] sm:top-6 sm:right-8 sm:text-[170px]"
        >
          {NUMERALS[index] ?? index + 1}
        </span>

        <div className="relative w-full p-5 pb-7 sm:p-9 sm:pb-10">
          <p className="eyebrow text-[9.5px] text-jade">{section.kicker}</p>
          <h2
            id={`${section.id}-title`}
            className="mt-3 font-display text-[clamp(30px,5.6vw,58px)] leading-none font-semibold tracking-[0.03em]"
          >
            <span className="text-metal">{section.title}</span>
          </h2>
          <p className="mt-3.5 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground sm:text-sm">{section.note}</p>
          <div className="mt-5 flex items-center gap-3">
            <span className={cn("eyebrow text-[9px] tracking-[0.24em]", complete ? "text-jade" : "text-gold")}>
              {complete ? "Chapter complete" : `${seen} of ${matching.length} watched`}
            </span>
            <span className="hairline-gold w-24 sm:w-40" />
          </div>
        </div>
      </header>

      {visible.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-white/10 px-4 py-5 text-center text-[13px] text-faint">
          Every title in this chapter is watched.
        </p>
      ) : (
        <ul
          className={cn(
            "mt-4",
            view === "grid"
              ? "grid grid-cols-2 gap-x-3.5 gap-y-7 min-[480px]:grid-cols-3 sm:grid-cols-[repeat(auto-fill,minmax(168px,1fr))] sm:gap-x-5 sm:gap-y-9"
              : "flex flex-col gap-2.5"
          )}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((t) => (
              <Item
                key={`${view}-${t.id}`}
                title={t}
                details={details[t.id]}
                done={watched.has(t.id)}
                onToggle={onToggle}
                onOpen={onOpen}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}

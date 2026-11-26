"use client";

import { AnimatePresence } from "motion/react";
import type { Section, StoryTitle } from "@/data/titles";
import type { DetailsMap } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import type { ViewKey } from "./filters";
import { TitleCard, TitleRow } from "./title-item";
import { BackdropImage } from "./tmdb-image";

interface Props {
  section: Section;
  matching: StoryTitle[];
  visible: StoryTitle[];
  watched: Set<string>;
  details: DetailsMap;
  view: ViewKey;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
}

export function SectionBlock({ section, matching, visible, watched, details, view, onToggle, onOpen }: Props) {
  const seen = matching.filter((t) => watched.has(t.id)).length;
  const complete = matching.length > 0 && seen === matching.length;
  const Item = view === "grid" ? TitleCard : TitleRow;

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="mt-9">
      <header className="relative isolate overflow-hidden rounded-2xl px-4 pt-12 pb-3.5">
        <div className="absolute inset-0 -z-10 opacity-40">
          <BackdropImage path={details[section.cover]?.backdrop} sizes="(max-width: 896px) 100vw, 896px" />
        </div>
        <div className="banner-veil absolute inset-0 -z-10" />
        <p className="text-[10.5px] font-bold tracking-[0.3em] text-doom uppercase text-glow">{section.kicker}</p>
        <div className="mt-1.5 flex items-center gap-3">
          <h2
            id={`${section.id}-title`}
            className="font-display text-[clamp(22px,4vw,30px)] font-bold tracking-[0.08em] whitespace-nowrap uppercase"
          >
            {section.title}
          </h2>
          <span className="h-px flex-1 bg-gradient-to-r from-input to-transparent" />
          <span className="text-xs whitespace-nowrap text-muted-foreground tabular-nums">
            <b className={cn("font-semibold text-foreground", complete && "text-doom")}>{seen}</b>/{matching.length}
          </span>
        </div>
        <p className="mt-1.5 max-w-[60ch] text-[13px] text-muted-foreground">{section.note}</p>
      </header>

      {visible.length === 0 ? (
        <p className="mt-1 rounded-[13px] border border-dashed px-4 py-3.5 text-center text-[13px] text-faint">
          All watched in this part.
        </p>
      ) : (
        <ul
          className={cn(
            "mt-1.5",
            view === "grid"
              ? "grid grid-cols-3 gap-x-2.5 gap-y-4 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:gap-x-3.5 sm:gap-y-6"
              : "flex flex-col gap-2"
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

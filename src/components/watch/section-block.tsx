"use client";

import { AnimatePresence, motion } from "motion/react";
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
  const numeral = NUMERALS[index] ?? String(index + 1);

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="mt-16 sm:mt-24">
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "group letterbox relative isolate flex min-h-[260px] items-end overflow-hidden rounded-3xl border border-white/[0.07] sm:min-h-[340px]",
          complete && "border-mint/25"
        )}
      >
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-75">
          <BackdropImage
            path={details[section.cover]?.backdrop}
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-[center_30%] saturate-[0.7] transition-transform duration-[3000ms] ease-out group-hover:scale-[1.035]"
          />
        </div>
        <div className="chapter-veil absolute inset-0 -z-10" />
        <span
          aria-hidden
          className="pointer-events-none absolute top-6 right-6 font-display text-[100px] leading-none font-bold text-transparent [-webkit-text-stroke:1px_rgb(184_184_184/0.18)] sm:top-8 sm:right-10 sm:text-[180px]"
        >
          {numeral}
        </span>

        <div className="relative w-full p-6 pb-8 sm:p-10 sm:pb-12">
          <p className="eyebrow text-[9px] text-steel">
            Chapter {numeral}
            <span className="mx-2.5 text-faint">—</span>
            {section.kicker}
          </p>
          {section.tagline && (
            <p className="poster-type mt-4 flex items-center gap-3 text-[15px] tracking-[0.22em] text-silver sm:text-[17px]">
              <span className="h-[2px] w-7 bg-crimson shadow-[0_0_10px_rgb(113_28_37/0.9)]" />
              {section.tagline}
            </p>
          )}
          <h2 id={`${section.id}-title`} className="poster-type mt-3 text-[clamp(46px,9vw,104px)] leading-[0.86]">
            <span className="text-metal">{section.title}</span>
          </h2>
          <p className="mt-4 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground sm:text-[14.5px]">{section.note}</p>
          <div className="mt-6 flex items-center gap-4">
            <span className={cn("eyebrow text-[9px] tracking-[0.26em]", complete ? "text-mint" : "text-silver")}>
              {complete ? "Chapter complete" : `${String(seen).padStart(2, "0")} / ${String(matching.length).padStart(2, "0")} watched`}
            </span>
            <span className="hairline-metal w-24 sm:w-44" />
          </div>
        </div>
      </motion.header>

      {visible.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-white/10 px-4 py-5 text-center font-mono text-[11px] tracking-[0.14em] text-steel uppercase">
          Every title in this chapter is watched.
        </p>
      ) : (
        <ul
          className={cn(
            "mt-5",
            view === "grid"
              ? "grid grid-cols-2 gap-x-3.5 gap-y-8 min-[480px]:grid-cols-3 sm:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] sm:gap-x-5 sm:gap-y-10"
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

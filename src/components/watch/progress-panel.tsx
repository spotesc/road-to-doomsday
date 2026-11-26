"use client";

import { motion } from "motion/react";
import type { StoryTitle } from "@/data/titles";
import { pad } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  titles: StoryTitle[];
  watched: Set<string>;
  essentialsLeft: number;
  hoursLeft: number;
  pace: string;
}

export function ProgressPanel({ titles, watched, essentialsLeft, hoursLeft, pace }: Props) {
  const done = titles.filter((t) => watched.has(t.id)).length;
  const pct = Math.round((done / titles.length) * 100);

  return (
    <motion.section
      aria-label="Your progress"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="panel relative overflow-hidden rounded-3xl bg-charcoal/70 px-5 py-6 sm:px-9 sm:py-8"
    >
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[70%] -translate-x-1/2 rounded-full bg-doom/50 blur-3xl" />

      <div className="relative flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <p className="eyebrow text-[9px] text-steel">Progress</p>
          <h2 className="poster-type mt-2 text-[28px] leading-none sm:text-[38px]">
            <span className="text-metal">Everything has led to this.</span>
          </h2>
        </div>
        <div className="flex items-baseline gap-3 font-mono">
          <span className="text-[44px] leading-none font-light tabular-nums sm:text-[56px]">
            <span className="text-metal">{pad(done)}</span>
          </span>
          <span className="text-sm text-steel">/ {titles.length}</span>
          <span className="ml-2 text-sm text-silver tabular-nums">{pct}%</span>
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={titles.length}
        className="relative mt-7 flex h-7 items-stretch gap-[3px]"
      >
        {titles.map((t, i) => (
          <span
            key={t.id}
            title={`${t.number}. ${t.title}`}
            className={cn(
              "flex-1 rounded-[2px] bg-white/[0.055] transition-[background,box-shadow] duration-700",
              i > 0 && titles[i - 1].sectionId !== t.sectionId && "ml-2.5",
              t.tier === "ess" && !watched.has(t.id) && "bg-crimson/25",
              watched.has(t.id) && "bg-gradient-to-b from-[#a9d4c2] via-mint to-forest shadow-[0_0_12px_rgb(143_191_170/0.4)]"
            )}
          />
        ))}
      </div>
      <p className="relative mt-3 flex items-center gap-2 font-mono text-[9.5px] tracking-[0.18em] text-steel uppercase">
        <span className="inline-block size-2 rounded-[1px] bg-crimson/80" /> Essential
        <span className="ml-4 inline-block size-2 rounded-[1px] bg-mint" /> Watched
      </p>

      <dl className="relative mt-6 grid grid-cols-3 divide-x divide-white/[0.07] border-t border-white/[0.07] pt-5">
        <Stat label="Essentials left" value={String(essentialsLeft)} />
        <Stat label="Runtime left" value={`${Math.round(hoursLeft)}h`} />
        <Stat label="Pace needed" value={pace} />
      </dl>
    </motion.section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 text-center first:pl-0 last:pr-0">
      <dt className="eyebrow text-[8px] tracking-[0.24em] text-steel">{label}</dt>
      <dd className="mt-2.5 font-mono text-[16px] font-light text-soft tabular-nums sm:text-[19px]">{value}</dd>
    </div>
  );
}

"use client";

import type { StoryTitle } from "@/data/titles";
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
    <section aria-label="Your progress" className="glass relative overflow-hidden rounded-3xl px-5 py-6 sm:px-8 sm:py-7">
      <div className="pointer-events-none absolute -top-24 right-0 size-64 rounded-full bg-jade/10 blur-3xl" />

      <div className="relative flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-[9.5px] text-faint">Your progress</p>
          <p className="mt-2 flex items-baseline gap-2.5">
            <span className="text-[52px] leading-none font-extralight tabular-nums sm:text-[64px]">{done}</span>
            <span className="text-sm text-muted-foreground">of {titles.length} watched</span>
          </p>
        </div>
        <p className="text-gilt font-display text-[28px] leading-none font-semibold sm:text-[34px]">{pct}%</p>
      </div>

      <div
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={titles.length}
        className="relative mt-6 flex h-6 items-stretch gap-[3px]"
      >
        {titles.map((t, i) => (
          <span
            key={t.id}
            title={`${t.number}. ${t.title}`}
            className={cn(
              "flex-1 rounded-[3px] bg-white/[0.06] transition-[background,box-shadow] duration-500",
              i > 0 && titles[i - 1].sectionId !== t.sectionId && "ml-2",
              t.tier === "ess" && !watched.has(t.id) && "bg-gold/[0.16]",
              watched.has(t.id) && "bg-gradient-to-b from-[#86f3b6] to-emerald shadow-[0_0_12px_rgb(61_220_132/0.45)]"
            )}
          />
        ))}
      </div>
      <p className="relative mt-2.5 flex items-center gap-2 text-[10.5px] text-faint">
        <span className="inline-block size-2 rounded-[2px] bg-gold/40" /> Essential
        <span className="ml-3 inline-block size-2 rounded-[2px] bg-jade" /> Watched
      </p>

      <dl className="relative mt-5 grid grid-cols-3 divide-x divide-white/[0.07] border-t border-white/[0.07] pt-5">
        <Stat label="Essentials left" value={String(essentialsLeft)} />
        <Stat label="Runtime left" value={`${Math.round(hoursLeft)}h`} />
        <Stat label="Pace needed" value={pace} />
      </dl>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 text-center first:pl-0 last:pr-0">
      <dt className="eyebrow text-[8.5px] tracking-[0.22em] text-faint">{label}</dt>
      <dd className="mt-2 text-[17px] font-light tabular-nums sm:text-xl">{value}</dd>
    </div>
  );
}

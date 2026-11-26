"use client";

import { Card } from "@/components/ui/card";
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
    <Card className="mt-7 gap-0 rounded-2xl bg-gradient-to-b from-secondary to-card px-5 py-5 ring-0 sm:px-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-[34px] leading-none font-bold tabular-nums">
          {done}
          <span className="text-base font-semibold text-muted-foreground"> / {titles.length}</span>
        </p>
        <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{pct}% complete</p>
      </div>

      <div className="mt-4 flex h-2.5 gap-[2px]" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={titles.length}>
        {titles.map((t, i) => (
          <span
            key={t.id}
            title={`${t.number}. ${t.title}`}
            className={cn(
              "flex-1 rounded-[2px] bg-[#1a211d] transition-[background,box-shadow] duration-300",
              i > 0 && titles[i - 1].sectionId !== t.sectionId && "ml-1.5",
              watched.has(t.id) && "bg-gradient-to-b from-[#6ff293] via-doom to-[#2fb257] shadow-[0_0_10px_rgb(63_224_106/0.5)]"
            )}
          />
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-[11.5px] text-muted-foreground">
        <div>
          <dt className="inline">Essentials left </dt>
          <dd className="inline font-semibold text-foreground">{essentialsLeft}</dd>
        </div>
        <div className="text-center">
          <dt className="inline">Runtime left </dt>
          <dd className="inline font-semibold text-foreground">{Math.round(hoursLeft)}h</dd>
        </div>
        <div className="text-right">
          <dt className="inline">Pace </dt>
          <dd className="inline font-semibold text-foreground">{pace}</dd>
        </div>
      </dl>
    </Card>
  );
}

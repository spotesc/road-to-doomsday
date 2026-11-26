"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StoryTitle } from "@/data/titles";
import { nameOf, pad } from "@/lib/format";
import type { DetailsMap } from "@/lib/tmdb";
import { BackdropImage, PosterImage } from "./tmdb-image";

interface Props {
  next: StoryTitle | null;
  total: number;
  details: DetailsMap;
  wholeList: boolean;
  releaseDay: string | null;
  onTick: (id: string) => void;
  onOpen: (id: string) => void;
}

export function UpNext({ next, total, details, wholeList, releaseDay, onTick, onOpen }: Props) {
  const d = next ? details[next.id] : undefined;

  return (
    <section
      aria-live="polite"
      className="relative mt-3.5 overflow-hidden rounded-2xl border border-doom/30 bg-[#080c0a] shadow-[0_0_40px_rgb(63_224_106/0.06)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {next ? (
          <motion.div
            key={next.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative grid grid-cols-[92px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6 sm:p-6"
          >
            <div className="absolute inset-0 opacity-55">
              <BackdropImage path={d?.backdrop} sizes="(max-width: 640px) 100vw, 880px" />
            </div>
            <div className="side-veil absolute inset-0" />

            <button
              type="button"
              onClick={() => onOpen(next.id)}
              aria-label={`${nameOf(next, d)}: details`}
              className="relative aspect-[2/3] self-start overflow-hidden rounded-[10px] bg-gradient-to-br from-[#1d2521] to-[#0b0f0d] shadow-[0_14px_30px_rgb(0_0_0/0.6),0_0_0_1px_rgb(255_255_255/0.08)]"
            >
              <PosterImage path={d?.poster} sizes="150px" />
            </button>

            <div className="relative flex min-w-0 flex-col">
              <p className="text-[10.5px] font-bold tracking-[0.28em] text-doom uppercase text-glow">
                Up next
                <span className="ml-2 text-muted-foreground [text-shadow:none]">
                  No. {pad(next.number)} of {total}
                </span>
              </p>
              <h2 className="mt-2 font-display text-[clamp(26px,5vw,38px)] leading-none font-bold tracking-[0.01em] uppercase">
                {nameOf(next, d)}
                {next.season && <span className="ml-2 text-muted-foreground">S{next.season}</span>}
              </h2>
              <p className="mt-2 text-[13.5px] text-[#c4ccc7] sm:text-[14.5px]">{next.why}</p>
              {d?.overview && (
                <p className="mt-2 line-clamp-2 hidden text-[13px] text-muted-foreground sm:block">{d.overview}</p>
              )}
              <div className="mt-auto hidden flex-wrap gap-2 pt-4 sm:flex">
                <Actions next={next} trailer={d?.trailer} onTick={onTick} onOpen={onOpen} />
              </div>
            </div>

            <div className="relative col-span-2 flex flex-wrap gap-2 sm:hidden">
              <Actions next={next} trailer={d?.trailer} onTick={onTick} onOpen={onOpen} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 py-8 text-center"
          >
            <p className="text-[10.5px] font-bold tracking-[0.28em] text-doom uppercase text-glow">
              {wholeList ? "Road complete" : "All done here"}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase">
              {wholeList ? "You're ready for Doomsday" : "Nothing left in this filter"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {wholeList
                ? `Every stop ticked. See you at the cinema${releaseDay ? ` on ${releaseDay}` : ""}.`
                : "Pick another filter to keep going."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Actions({
  next,
  trailer,
  onTick,
  onOpen,
}: {
  next: StoryTitle;
  trailer?: string | null;
  onTick: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <>
      <Button
        onClick={() => onTick(next.id)}
        className="h-10 basis-full rounded-full px-4 shadow-glow sm:basis-auto"
      >
        <Check className="stroke-3" />
        Mark watched
      </Button>
      {trailer && (
        <Button asChild variant="outline" className="h-10 flex-1 rounded-full bg-card/70 px-4 sm:flex-none">
          <a href={`https://www.youtube.com/watch?v=${trailer}`} target="_blank" rel="noopener noreferrer">
            <Play className="fill-current" />
            Trailer
          </a>
        </Button>
      )}
      <Button
        variant="outline"
        onClick={() => onOpen(next.id)}
        className="h-10 flex-1 rounded-full bg-card/70 px-4 sm:flex-none"
      >
        <Info />
        Details
      </Button>
    </>
  );
}

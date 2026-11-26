"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Info, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StoryTitle } from "@/data/titles";
import { KINDS, lengthText, nameOf, pad } from "@/lib/format";
import type { DetailsMap } from "@/lib/tmdb";
import { TierBadge } from "./badges";
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

export const primaryButton =
  "h-11 rounded-full border-0 bg-gradient-to-b from-[#6ff0a8] to-[#1fb062] px-6 font-semibold text-primary-foreground shadow-[0_12px_30px_-10px_rgb(61_220_132/0.7),inset_0_1px_0_rgb(255_255_255/0.4)] hover:brightness-110";

export const ghostButton =
  "h-11 rounded-full border-white/12 bg-white/[0.05] px-5 font-medium backdrop-blur-md hover:border-white/25 hover:bg-white/10";

export function UpNext({ next, total, details, wholeList, releaseDay, onTick, onOpen }: Props) {
  const d = next ? details[next.id] : undefined;

  return (
    <section
      aria-live="polite"
      className="letterbox relative isolate mt-6 overflow-hidden rounded-3xl border border-white/[0.07] bg-card shadow-[0_50px_100px_-50px_rgb(0_0_0/0.95)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {next ? (
          <motion.div
            key={next.id}
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative grid grid-cols-[96px_minmax(0,1fr)] items-end gap-x-5 gap-y-5 px-5 pt-14 pb-7 sm:min-h-[440px] sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-x-9 sm:px-10 sm:pt-24 sm:pb-11"
          >
            <div className="absolute inset-0 -z-10">
              <BackdropImage path={d?.backdrop} sizes="(max-width: 1024px) 100vw, 1024px" className="object-[center_25%]" />
            </div>
            <div className="feature-veil absolute inset-0 -z-10" />

            <button
              type="button"
              onClick={() => onOpen(next.id)}
              aria-label={`${nameOf(next, d)}: details`}
              className="sheen relative aspect-[2/3] self-end overflow-hidden rounded-xl bg-secondary shadow-[0_30px_60px_-15px_rgb(0_0_0/0.85)] ring-1 ring-white/12 sm:row-span-3"
            >
              <PosterImage path={d?.poster} sizes="190px" />
            </button>

            <div className="min-w-0 self-end">
              <p className="eyebrow text-[9.5px] text-jade">
                Up next
                <span className="mt-1.5 block text-faint sm:mt-0 sm:ml-3 sm:inline">
                  No. {pad(next.number)} / {total}
                </span>
              </p>
              <h2 className="mt-3 font-display text-[clamp(26px,5.2vw,54px)] leading-[1.02] font-semibold tracking-[0.02em]">
                <span className="text-metal">{nameOf(next, d)}</span>
                {next.season && <span className="ml-3 text-[0.55em] text-muted-foreground">Season {next.season}</span>}
              </h2>
              <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[12.5px] text-muted-foreground">
                <span>{next.year}</span>
                <span className="text-faint">•</span>
                <span>{KINDS[next.kind]}</span>
                {lengthText(next, d) && (
                  <>
                    <span className="text-faint">•</span>
                    <span>{lengthText(next, d)}</span>
                  </>
                )}
                {d?.rating && (
                  <>
                    <span className="text-faint">•</span>
                    <span className="inline-flex items-center gap-1 text-gold-bright">
                      <Star className="size-3 fill-current" />
                      {d.rating.toFixed(1)}
                    </span>
                  </>
                )}
                <TierBadge title={next} className="ml-1" />
              </p>
            </div>

            <p className="col-span-2 max-w-xl text-[15px] leading-relaxed text-[#d4dad7] sm:col-span-1 sm:col-start-2 sm:text-[16px]">
              {next.why}
            </p>

            <div className="col-span-2 flex flex-wrap gap-2.5 sm:col-span-1 sm:col-start-2">
              <Button onClick={() => onTick(next.id)} className={`${primaryButton} basis-full sm:basis-auto`}>
                <Check className="stroke-3" />
                Mark as watched
              </Button>
              {d?.trailer && (
                <Button asChild variant="outline" className={`${ghostButton} flex-1 sm:flex-none`}>
                  <a href={`https://www.youtube.com/watch?v=${d.trailer}`} target="_blank" rel="noopener noreferrer">
                    <Play className="fill-current" />
                    Trailer
                  </a>
                </Button>
              )}
              <Button variant="outline" onClick={() => onOpen(next.id)} className={`${ghostButton} flex-1 sm:flex-none`}>
                <Info />
                Details
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6 py-20 text-center"
          >
            <p className="eyebrow text-[10px] text-jade">{wholeList ? "Road complete" : "All done here"}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,5vw,46px)] font-semibold">
              <span className="text-metal">{wholeList ? "You're ready for Doomsday" : "Nothing left in this filter"}</span>
            </h2>
            <div className="hairline-gold mx-auto mt-5 w-36" />
            <p className="mt-5 text-sm text-muted-foreground">
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

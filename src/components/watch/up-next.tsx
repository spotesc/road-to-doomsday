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
  position: number;
  total: number;
  details: DetailsMap;
  wholeList: boolean;
  releaseDay: string | null;
  onTick: (id: string) => void;
  onOpen: (id: string) => void;
}

export const primaryButton =
  "h-11 rounded-full border-0 bg-[linear-gradient(180deg,#f4f4f4_0%,#c9c9c9_45%,#9a9a9a_100%)] px-6 font-mono text-[11px] font-medium tracking-[0.2em] text-obsidian uppercase shadow-[inset_0_1px_0_rgb(255_255_255/0.9),inset_0_-1px_0_rgb(0_0_0/0.25),0_14px_34px_-14px_rgb(184_184_184/0.6)] transition-[filter,box-shadow,transform] duration-500 hover:brightness-110 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_0_0_1px_rgb(143_191_170/0.35),0_18px_40px_-12px_rgb(60_130_105/0.55)] active:scale-[0.98]";

export const ghostButton =
  "h-11 rounded-full border-silver/25 bg-black/35 px-5 font-mono text-[11px] font-medium tracking-[0.2em] text-silver uppercase backdrop-blur-md transition-[border-color,background,color] duration-500 hover:border-silver/55 hover:bg-black/55 hover:text-soft";

export function UpNext({ next, position, total, details, wholeList, releaseDay, onTick, onOpen }: Props) {
  const d = next ? details[next.id] : undefined;

  return (
    <motion.section
      aria-live="polite"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="group relative isolate mt-7 overflow-hidden rounded-3xl border border-white/[0.08] bg-obsidian shadow-[0_60px_120px_-50px_rgb(0_0_0/1)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {next ? (
          <motion.div
            key={next.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative grid grid-cols-[96px_minmax(0,1fr)] items-end gap-x-5 gap-y-5 px-5 pt-14 pb-8 sm:min-h-[480px] sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-x-10 sm:px-11 sm:pt-28 sm:pb-12"
          >
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <BackdropImage
                path={d?.backdrop}
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-[center_25%] saturate-[0.8] transition-transform duration-[2500ms] ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="feature-veil absolute inset-0 -z-10" />

            <button
              type="button"
              onClick={() => onOpen(next.id)}
              aria-label={`${nameOf(next, d)}: details`}
              className="sheen relative aspect-[2/3] self-end overflow-hidden rounded-lg bg-charcoal shadow-[0_40px_70px_-20px_rgb(0_0_0/0.95)] ring-1 ring-silver/15 sm:row-span-3"
            >
              <PosterImage path={d?.poster} sizes="200px" />
            </button>

            <div className="min-w-0 self-end">
              <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[9.5px] text-silver">
                Up next
                <span className="h-px w-8 bg-crimson" />
                <span className="text-silver/80 [text-shadow:0_1px_8px_rgb(0_0_0/0.9)]">
                  Stop {pad(position)} / {pad(total)}
                </span>
              </p>
              <h2 className="poster-type mt-3 text-[clamp(40px,8vw,92px)] leading-[0.88]">
                <span className="text-metal">{nameOf(next, d)}</span>
                {next.season && <span className="ml-3 text-[0.42em] tracking-[0.12em] text-steel">Season {next.season}</span>}
              </h2>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10.5px] tracking-[0.14em] text-steel uppercase">
                <span>{next.year}</span>
                <span className="text-faint">/</span>
                <span>{KINDS[next.kind]}</span>
                {lengthText(next, d) && (
                  <>
                    <span className="text-faint">/</span>
                    <span>{lengthText(next, d)}</span>
                  </>
                )}
                {d?.rating && (
                  <>
                    <span className="text-faint">/</span>
                    <span className="inline-flex items-center gap-1.5 text-silver">
                      <Star className="size-3 fill-current" />
                      {d.rating.toFixed(1)}
                    </span>
                  </>
                )}
                <TierBadge title={next} />
              </p>
            </div>

            <p className="col-span-2 max-w-xl text-[15px] leading-relaxed text-[#cfcfcf] sm:col-span-1 sm:col-start-2 sm:text-[16.5px]">
              {next.why}
            </p>

            <div className="col-span-2 flex flex-wrap gap-2.5 sm:col-span-1 sm:col-start-2">
              <Button onClick={() => onTick(next.id)} className={`${primaryButton} basis-full sm:basis-auto`}>
                <Check className="stroke-[2.5]" />
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
            className="px-6 py-24 text-center"
          >
            <p className="eyebrow text-[9.5px] text-mint">{wholeList ? "Road complete" : "All done here"}</p>
            <h2 className="poster-type mt-4 text-[clamp(40px,7vw,72px)] leading-none">
              <span className="text-metal">{wholeList ? "Ready for Doomsday" : "Nothing left in this filter"}</span>
            </h2>
            <div className="hairline-metal mx-auto mt-6 w-40" />
            <p className="mt-6 text-sm text-muted-foreground">
              {wholeList
                ? `Every stop ticked. See you at the cinema${releaseDay ? ` on ${releaseDay}` : ""}.`
                : "Pick another filter to keep going."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

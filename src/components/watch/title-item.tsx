"use client";

import { forwardRef } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { StoryTitle } from "@/data/titles";
import { KINDS, fullName, lengthText, nameOf, pad } from "@/lib/format";
import type { TitleDetails } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { TierBadge } from "./badges";
import { BackdropImage, PosterImage } from "./tmdb-image";

interface Props {
  title: StoryTitle;
  details?: TitleDetails;
  done: boolean;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
}

const motionProps = {
  layout: "position" as const,
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.35 } },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
};

function Tick({ title, details, done, onToggle, className }: Omit<Props, "onOpen"> & { className?: string }) {
  return (
    <Checkbox
      checked={done}
      onCheckedChange={() => onToggle(title.id)}
      onClick={(e) => e.stopPropagation()}
      aria-label={`Watched ${fullName(title, details)}`}
      className={cn(
        "relative size-7 shrink-0 rounded-full border border-silver/30 bg-black/50 backdrop-blur-sm transition-[background,border-color,box-shadow] duration-500 [&_svg]:size-3.5 [&_svg]:stroke-[3]",
        "hover:border-silver/70",
        "data-[state=checked]:border-mint/60 data-[state=checked]:bg-[radial-gradient(circle_at_35%_30%,#3f6d5d,#18372f_70%)] data-[state=checked]:text-soft data-[state=checked]:shadow-[0_0_0_4px_rgb(24_55_47/0.55),0_0_22px_rgb(60_130_105/0.6)]",
        "after:pointer-events-none after:absolute after:-inset-px after:rounded-full after:border after:border-mint after:opacity-0 data-[state=checked]:after:animate-ping-once",
        className
      )}
    />
  );
}

function Eyebrow({ title, details }: { title: StoryTitle; details?: TitleDetails }) {
  const length = lengthText(title, details);
  return (
    <p className="flex items-center gap-x-2.5 font-mono text-[10px] tracking-[0.14em] whitespace-nowrap text-steel uppercase sm:tracking-[0.18em]">
      <span className="text-[11.5px] tracking-[0.06em] text-silver">{pad(title.number)}</span>
      <span className="h-3 w-px bg-white/12" />
      <span className="hidden sm:inline">{KINDS[title.kind]}</span>
      <span className="hidden text-faint sm:inline">/</span>
      <span>{title.year}</span>
      {length && (
        <>
          <span className="text-faint">/</span>
          <span>{length}</span>
        </>
      )}
    </p>
  );
}

export const TitleRow = forwardRef<HTMLLIElement, Props>(function TitleRow(
  { title, details, done, onToggle, onOpen },
  ref
) {
  return (
    <motion.li
      ref={ref}
      {...motionProps}
      onClick={() => onToggle(title.id)}
      className={cn(
        "group relative isolate cursor-pointer overflow-hidden rounded-2xl border border-white/[0.07] bg-charcoal/85 shadow-[0_24px_50px_-35px_rgb(0_0_0/1)] transition-[border-color,transform,box-shadow] duration-500 ease-out hover:-translate-y-px hover:border-silver/20 hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/1)]",
        done && "border-mint/15"
      )}
    >
      <div className="fade-left absolute inset-y-0 right-0 -z-10 w-[72%] overflow-hidden opacity-[0.2] transition-opacity duration-700 group-hover:opacity-[0.38]">
        <BackdropImage
          path={details?.backdrop}
          sizes="440px"
          className={cn("saturate-[0.7] transition-transform duration-[2000ms] ease-out group-hover:scale-105", done && "grayscale")}
        />
      </div>
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-4 left-0 w-[2px] rounded-full bg-mint shadow-[0_0_12px_rgb(143_191_170/0.8)] transition-opacity duration-500",
          done ? "opacity-100" : "opacity-0"
        )}
      />

      <div className="flex items-center gap-3.5 p-3 sm:gap-5 sm:p-4">
        <Tick title={title} details={details} done={done} onToggle={onToggle} />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(title.id);
          }}
          aria-label={`${fullName(title, details)}: details`}
          className="sheen relative aspect-[2/3] w-[52px] shrink-0 overflow-hidden rounded-md bg-charcoal shadow-[0_14px_28px_-10px_rgb(0_0_0/0.9)] ring-1 ring-silver/15 sm:w-[64px]"
        >
          <PosterImage
            path={details?.poster}
            sizes="64px"
            className={cn("transition-[filter] duration-700", done && "brightness-50 grayscale")}
          />
        </button>

        <div className={cn("min-w-0 flex-1 transition-opacity duration-500", done && "opacity-50")}>
          <Eyebrow title={title} details={details} />
          <p className="mt-1.5 text-[15.5px] leading-snug font-semibold tracking-[-0.01em] text-soft sm:text-[17px]">
            {nameOf(title, details)}
            {title.season && <span className="font-normal text-steel"> · Season {title.season}</span>}
          </p>
          <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted-foreground sm:line-clamp-1">{title.why}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <TierBadge title={title} />
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(title.id);
          }}
          aria-label={`${fullName(title, details)}: details`}
          className="-mr-1 grid size-9 shrink-0 place-items-center rounded-full text-steel transition-colors duration-300 hover:bg-white/[0.06] hover:text-soft"
        >
          <ChevronRight className="size-[18px] transition-transform duration-500 group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.li>
  );
});

export const TitleCard = forwardRef<HTMLLIElement, Props>(function TitleCard(
  { title, details, done, onToggle, onOpen },
  ref
) {
  return (
    <motion.li ref={ref} {...motionProps} className="group relative">
      <button
        type="button"
        onClick={() => onOpen(title.id)}
        aria-label={`${fullName(title, details)}: details`}
        className={cn(
          "sheen relative block aspect-[2/3] w-full overflow-hidden rounded-xl bg-charcoal shadow-[0_34px_60px_-28px_rgb(0_0_0/1)] ring-1 ring-silver/12 transition-[transform,box-shadow] duration-700 ease-out",
          "hover:-translate-y-2 hover:shadow-[0_50px_80px_-30px_rgb(0_0_0/1),0_0_0_1px_rgb(184_184_184/0.3),0_0_40px_-10px_rgb(60_130_105/0.35)]",
          done && "ring-1 ring-mint/50 shadow-[0_0_34px_-6px_rgb(60_130_105/0.5)]"
        )}
      >
        {!details?.poster && (
          <span className="poster-type absolute inset-0 flex items-end p-4 text-left text-2xl leading-none">
            <span className="text-metal">{title.title}</span>
          </span>
        )}
        <PosterImage
          path={details?.poster}
          sizes="(max-width: 480px) 50vw, (max-width: 640px) 33vw, 220px"
          className={cn(
            "transition-[filter,transform] duration-[1600ms] ease-out group-hover:scale-[1.06]",
            done && "brightness-[0.3] grayscale"
          )}
        />
        <span className="absolute top-2.5 left-2.5 rounded-full border border-white/10 bg-black/55 px-2 py-1 font-mono text-[11px] leading-none tracking-[0.08em] text-silver backdrop-blur-sm">
          {pad(title.number)}
        </span>
        {done && (
          <span className="eyebrow absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[10px] text-mint [text-shadow:0_0_16px_rgb(60_130_105/0.9)]">
            Watched
          </span>
        )}
      </button>
      <Tick title={title} details={details} done={done} onToggle={onToggle} className="absolute top-2.5 right-2.5" />
      <div className={cn("px-0.5 pt-3.5 transition-opacity duration-500", done && "opacity-50")}>
        <p className="line-clamp-2 text-[13.5px] leading-snug font-semibold text-soft">
          {nameOf(title, details)}
          {title.season && <span className="font-normal text-steel"> · S{title.season}</span>}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <TierBadge title={title} />
          <span className="font-mono text-[10px] text-steel">{title.year}</span>
        </div>
      </div>
    </motion.li>
  );
});

"use client";

import { forwardRef } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { StoryTitle } from "@/data/titles";
import { KINDS, fullName, lengthText, nameOf, pad } from "@/lib/format";
import type { TitleDetails } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { PickBadge, TierBadge } from "./badges";
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
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.2 } },
  transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as const },
};

function Tick({ title, details, done, onToggle, className }: Omit<Props, "onOpen"> & { className?: string }) {
  return (
    <Checkbox
      checked={done}
      onCheckedChange={() => onToggle(title.id)}
      onClick={(e) => e.stopPropagation()}
      aria-label={`Watched ${fullName(title, details)}`}
      className={cn(
        "relative size-7 shrink-0 rounded-full border border-white/25 bg-black/40 backdrop-blur-sm transition-[background,border-color,box-shadow] [&_svg]:size-3.5 [&_svg]:stroke-[3.5]",
        "hover:border-jade/70",
        "data-[state=checked]:border-transparent data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-[#86f3b6] data-[state=checked]:to-[#1fb062] data-[state=checked]:text-primary-foreground data-[state=checked]:shadow-[0_0_0_4px_rgb(61_220_132/0.14),0_0_20px_rgb(61_220_132/0.55)]",
        "after:pointer-events-none after:absolute after:-inset-px after:rounded-full after:border-2 after:border-jade after:opacity-0 data-[state=checked]:after:animate-ping-once",
        className
      )}
    />
  );
}

function Eyebrow({ title, details }: { title: StoryTitle; details?: TitleDetails }) {
  const length = lengthText(title, details);
  return (
    <p className="flex items-center gap-x-2 text-[10px] font-semibold tracking-[0.14em] whitespace-nowrap text-faint uppercase sm:tracking-[0.2em]">
      <span className="font-display text-[13px] tracking-[0.06em] text-gold">{pad(title.number)}</span>
      <span className="h-3 w-px bg-white/10" />
      <span className="hidden sm:inline">{KINDS[title.kind]}</span>
      <span className="hidden sm:inline">·</span>
      <span>{title.year}</span>
      {length && (
        <>
          <span>·</span>
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
        "group relative isolate cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-card/80 shadow-[0_20px_40px_-30px_rgb(0_0_0/0.9)] transition-colors duration-300 hover:border-white/[0.14]",
        done && "border-jade/15"
      )}
    >
      <div className="fade-left absolute inset-y-0 right-0 -z-10 w-[70%] opacity-[0.22] transition-opacity duration-500 group-hover:opacity-[0.42]">
        <BackdropImage path={details?.backdrop} sizes="420px" className={cn(done && "grayscale")} />
      </div>
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-3 left-0 w-[2px] rounded-full bg-jade shadow-[0_0_10px_rgb(61_220_132/0.8)] transition-opacity duration-300",
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
          className="sheen relative aspect-[2/3] w-[52px] shrink-0 overflow-hidden rounded-lg bg-secondary shadow-[0_12px_24px_-8px_rgb(0_0_0/0.8)] ring-1 ring-white/10 sm:w-[62px]"
        >
          <PosterImage
            path={details?.poster}
            sizes="62px"
            className={cn("transition-[filter] duration-500", done && "brightness-50 grayscale")}
          />
        </button>

        <div className={cn("min-w-0 flex-1 transition-opacity duration-300", done && "opacity-55")}>
          <Eyebrow title={title} details={details} />
          <p className="mt-1.5 text-[15.5px] leading-snug font-semibold tracking-[-0.01em] sm:text-[17px]">
            {nameOf(title, details)}
            {title.season && <span className="font-normal text-muted-foreground"> · Season {title.season}</span>}
          </p>
          <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted-foreground sm:line-clamp-1">{title.why}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <TierBadge title={title} />
            {title.pick && <PickBadge />}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(title.id);
          }}
          aria-label={`${fullName(title, details)}: details`}
          className="-mr-1 grid size-9 shrink-0 place-items-center rounded-full text-faint transition-colors hover:bg-white/[0.06] hover:text-foreground"
        >
          <ChevronRight className="size-[18px]" />
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
          "sheen relative block aspect-[2/3] w-full overflow-hidden rounded-2xl bg-secondary shadow-[0_30px_50px_-25px_rgb(0_0_0/0.95)] ring-1 ring-white/10 transition-[transform,box-shadow] duration-500 ease-out",
          "hover:-translate-y-1.5 hover:shadow-[0_40px_60px_-25px_rgb(0_0_0/0.95),0_0_0_1px_rgb(255_255_255/0.2)]",
          done && "ring-2 ring-jade/70 shadow-[0_0_30px_-5px_rgb(61_220_132/0.45)]"
        )}
      >
        {!details?.poster && (
          <span className="absolute inset-0 flex items-end p-4 text-left font-display text-lg leading-tight font-semibold text-steel">
            {title.title}
          </span>
        )}
        <PosterImage
          path={details?.poster}
          sizes="(max-width: 480px) 50vw, (max-width: 640px) 33vw, 220px"
          className={cn("transition-[filter,transform] duration-700 group-hover:scale-[1.05]", done && "brightness-[0.35] grayscale")}
        />
        <span className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/70 to-transparent" />
        <span className="absolute top-3 left-3.5 font-display text-lg leading-none font-semibold text-gold [text-shadow:0_2px_10px_rgb(0_0_0/0.9)]">
          {pad(title.number)}
        </span>
        {done && (
          <span className="eyebrow absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[11px] text-jade [text-shadow:0_0_16px_rgb(61_220_132/0.8)]">
            Watched
          </span>
        )}
      </button>
      <Tick title={title} details={details} done={done} onToggle={onToggle} className="absolute top-2.5 right-2.5" />
      <div className={cn("px-0.5 pt-3 transition-opacity", done && "opacity-55")}>
        <p className="line-clamp-2 text-[13.5px] leading-snug font-semibold">
          {nameOf(title, details)}
          {title.season && <span className="font-normal text-muted-foreground"> · S{title.season}</span>}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <TierBadge title={title} />
          <span className="text-[11px] text-faint">{title.year}</span>
        </div>
      </div>
    </motion.li>
  );
});

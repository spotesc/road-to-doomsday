"use client";

import { forwardRef } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { StoryTitle } from "@/data/titles";
import { fullName, nameOf, pad } from "@/lib/format";
import type { TitleDetails } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { TierBadge, TitleBadges } from "./badges";
import { PosterImage } from "./tmdb-image";

interface Props {
  title: StoryTitle;
  details?: TitleDetails;
  done: boolean;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
}

const motionProps = {
  layout: "position" as const,
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
  transition: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] as const },
};

function Tick({ title, details, done, onToggle, className }: Omit<Props, "onOpen"> & { className?: string }) {
  return (
    <Checkbox
      checked={done}
      onCheckedChange={() => onToggle(title.id)}
      onClick={(e) => e.stopPropagation()}
      aria-label={`Watched ${fullName(title, details)}`}
      className={cn(
        "relative size-[26px] shrink-0 rounded-[7px] border-2 border-input bg-[#080b09] transition-[background,border-color,box-shadow] [&_svg]:size-4 [&_svg]:stroke-[3.5]",
        "data-[state=checked]:border-doom data-[state=checked]:bg-doom data-[state=checked]:text-primary-foreground data-[state=checked]:shadow-[0_0_14px_rgb(63_224_106/0.5)]",
        "after:pointer-events-none after:absolute after:-inset-0.5 after:rounded-[9px] after:border-2 after:border-doom after:opacity-0 data-[state=checked]:after:animate-ping-once",
        className
      )}
    />
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
        "group flex cursor-pointer items-center gap-3 rounded-[13px] border bg-card px-3 py-2.5 transition-colors hover:border-input hover:bg-secondary sm:px-3.5 sm:py-3",
        done && "bg-[#0a0d0b]"
      )}
    >
      <Tick title={title} details={details} done={done} onToggle={onToggle} />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen(title.id);
        }}
        aria-label={`${fullName(title, details)}: details`}
        className="relative aspect-[2/3] w-[42px] shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-[#1d2521] to-[#0b0f0d] shadow-[0_6px_14px_rgb(0_0_0/0.5),0_0_0_1px_rgb(255_255_255/0.06)] sm:w-[52px]"
      >
        <PosterImage
          path={details?.poster}
          sizes="52px"
          className={cn("transition-[filter] duration-300", done && "brightness-45 grayscale")}
        />
      </button>

      <div className={cn("min-w-0 flex-1 transition-opacity", done && "opacity-45")}>
        <p className={cn("text-[15px] font-semibold tracking-[-0.01em]", done && "line-through decoration-faint")}>
          {nameOf(title, details)}
          {title.season && <span className="font-medium text-faint"> S{title.season}</span>}
          <span className="font-medium text-faint"> · {title.year}</span>
        </p>
        <p className="mt-0.5 text-[12.5px] text-muted-foreground">{title.why}</p>
        <div className="mt-2">
          <TitleBadges title={title} details={details} />
        </div>
      </div>

      <span
        aria-hidden
        className={cn(
          "hidden min-w-6 text-right font-display text-sm font-semibold text-faint tabular-nums sm:block",
          done && "opacity-45"
        )}
      >
        {pad(title.number)}
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen(title.id);
        }}
        aria-label={`${fullName(title, details)}: details`}
        className="-mr-1 grid size-8 shrink-0 place-items-center rounded-full border border-transparent text-faint transition-colors hover:border-input hover:bg-secondary hover:text-foreground"
      >
        <ChevronRight className="size-[18px]" />
      </button>
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
          "relative block aspect-[2/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#1d2521] to-[#0b0f0d] shadow-[0_14px_30px_rgb(0_0_0/0.55),0_0_0_1px_rgb(255_255_255/0.08)] transition-[transform,box-shadow] duration-300 ease-out",
          "hover:-translate-y-1 hover:shadow-[0_22px_40px_rgb(0_0_0/0.6),0_0_0_1px_rgb(63_224_106/0.3)]",
          done && "shadow-[0_0_0_2px_var(--doom),0_0_24px_rgb(63_224_106/0.25)]"
        )}
      >
        {!details?.poster && (
          <span className="absolute inset-0 flex items-end p-3 text-left font-display text-lg leading-tight font-bold text-foreground/75 uppercase">
            {title.title}
          </span>
        )}
        <PosterImage
          path={details?.poster}
          sizes="(max-width: 640px) 33vw, 200px"
          className={cn("transition-[filter,transform] duration-500 group-hover:scale-[1.04]", done && "brightness-35 grayscale")}
        />
        <span className="absolute top-2 left-2 rounded-md border border-white/15 bg-black/60 px-1.5 py-0.5 font-display text-xs font-bold backdrop-blur-sm">
          {pad(title.number)}
        </span>
        {done && (
          <span className="absolute inset-x-0 bottom-3 text-center font-display text-sm font-bold tracking-[0.3em] text-doom uppercase text-glow">
            Watched
          </span>
        )}
      </button>
      <Tick
        title={title}
        details={details}
        done={done}
        onToggle={onToggle}
        className="absolute top-2 right-2 size-8 border-white/35 bg-black/60 backdrop-blur-sm"
      />
      <div className={cn("px-0.5 pt-2.5 transition-opacity", done && "opacity-45")}>
        <p className="line-clamp-2 text-[13px] leading-snug font-semibold sm:text-sm">
          {nameOf(title, details)}
          {title.season && <span className="font-medium text-faint"> S{title.season}</span>}
        </p>
        <div className="mt-1.5">
          <TierBadge title={title} />
        </div>
      </div>
    </motion.li>
  );
});

"use client";

import { ArrowUpRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const PROFILE = "https://x.com/spotesc";

export function SiteFooter({ canReset, onReset }: { canReset: boolean; onReset: () => void }) {
  return (
    <footer className="mt-24 pb-[calc(5rem+env(safe-area-inset-bottom))] text-center sm:mt-32">
      <div className="hairline-metal mx-auto w-full max-w-3xl" />

      <p className="eyebrow mt-16 text-[9px] tracking-[0.4em] text-steel">Designed by</p>
      <a
        href={PROFILE}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Spotesc on X"
        className="group mt-4 inline-block"
      >
        <span className="glow-doom block font-display text-[clamp(34px,7vw,56px)] leading-none font-semibold tracking-[0.24em] transition-[filter] duration-700 group-hover:brightness-125">
          <span className="text-metal-glint">Spotesc</span>
        </span>
      </a>
      <div className="mt-6">
        <a
          href={PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-silver/20 bg-black/30 px-4 font-mono text-[10px] tracking-[0.24em] text-silver uppercase backdrop-blur-md transition-[border-color,color,background] duration-500 hover:border-silver/45 hover:bg-black/50 hover:text-soft"
        >
          @spotesc on X
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>

      <div className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-4 border-y border-white/[0.06] py-6 sm:flex-row sm:justify-between">
        <p className="poster-type text-[18px] tracking-[0.34em] text-silver">Road to Doomsday</p>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9.5px] tracking-[0.2em] text-steel uppercase">Ticks saved on this device</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={!canReset}
                className="h-8 rounded-full border-silver/20 bg-transparent px-4 font-mono text-[10px] tracking-[0.18em] text-silver uppercase hover:border-silver/45 hover:text-soft"
              >
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl border-white/10 bg-popover">
              <AlertDialogHeader>
                <AlertDialogTitle className="poster-type text-2xl">Clear all your ticks?</AlertDialogTitle>
                <AlertDialogDescription>
                  This only clears this device. Anyone you shared the list with keeps their own ticks.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">Keep them</AlertDialogCancel>
                <AlertDialogAction onClick={onReset} className="rounded-full bg-crimson text-soft hover:bg-crimson/85">
                  Clear ticks
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-2xl space-y-3 px-2 text-[12px] leading-relaxed text-faint">
        <p>
          An unofficial fan project, not affiliated with or endorsed by Marvel Studios or Disney. All images and posters
          are freely sourced from TMDB and belong to their respective owners.
        </p>
        <p>
          Story order follows Disney+’s timeline. “Disney+ pick” marks the titles on Disney+’s official Doomsday
          watchlist.
        </p>
      </div>

      <p className="mt-10 font-mono text-[9px] tracking-[0.34em] text-faint uppercase">© 2026 Spotesc</p>
    </footer>
  );
}

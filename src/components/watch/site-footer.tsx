"use client";

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

export function SiteFooter({ canReset, onReset }: { canReset: boolean; onReset: () => void }) {
  return (
    <footer className="mt-16 pb-[calc(4rem+env(safe-area-inset-bottom))] text-center">
      <div className="hairline mx-auto w-full" />
      <p className="eyebrow mt-10 text-[9px] text-faint">A</p>
      <p className="mt-2 font-display text-xl tracking-[0.18em]">
        <span className="text-metal">SPOTESC</span>
      </p>
      <p className="eyebrow mt-2 text-[9px] text-faint">Production · @spotesc</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[12px] text-muted-foreground">
        <span>Your ticks are saved on this device</span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={!canReset}
              className="h-8 rounded-full border-white/12 bg-transparent px-3.5 text-[11.5px] text-muted-foreground hover:border-white/25 hover:text-foreground"
            >
              Reset list
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl border-white/10 bg-popover">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display tracking-[0.02em]">Clear all your ticks?</AlertDialogTitle>
              <AlertDialogDescription>
                This only clears this device. Anyone you shared the list with keeps their own ticks.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Keep them</AlertDialogCancel>
              <AlertDialogAction onClick={onReset} className="rounded-full bg-destructive text-white hover:bg-destructive/85">
                Clear ticks
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-2 text-[11px] leading-relaxed text-faint">
        <p>
          Story order follows Disney+’s timeline. “Disney+ pick” marks the titles on Disney+’s official Doomsday
          watchlist. Posters and details from{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground underline decoration-white/20 underline-offset-2 hover:text-foreground"
          >
            TMDB
          </a>
          ; this site uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
        <p>
          An unofficial fan list, not connected to Marvel Studios or Disney. Marvel, the Avengers logo and the Doomsday
          poster belong to Marvel.
        </p>
      </div>
    </footer>
  );
}

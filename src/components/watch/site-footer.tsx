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
    <footer className="mt-9 border-t pt-5 pb-[calc(4rem+env(safe-area-inset-bottom))] text-[11.5px] text-faint">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3.5">
        <span className="font-display text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Spotesc · @spotesc
        </span>
        <span>Ticks save on this device</span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={!canReset}
              className="rounded-full text-[11px] text-faint hover:border-doom hover:text-doom"
            >
              Reset list
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-input bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all your ticks?</AlertDialogTitle>
              <AlertDialogDescription>
                This only clears this device. Anyone you shared the list with keeps their own ticks.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep them</AlertDialogCancel>
              <AlertDialogAction onClick={onReset} className="bg-destructive text-white hover:bg-destructive/85">
                Clear ticks
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <p className="mb-1.5 max-w-[72ch]">
        Story order follows Disney+’s timeline. “Disney+ pick” marks the titles on Disney+’s official Doomsday watchlist.
        Posters and details from{" "}
        <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline underline-offset-2">
          TMDB
        </a>
        ; this site uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
      <p className="max-w-[72ch]">
        An unofficial fan list, not connected to Marvel Studios or Disney. Marvel, the Avengers logo and the Doomsday
        poster belong to Marvel.
      </p>
    </footer>
  );
}

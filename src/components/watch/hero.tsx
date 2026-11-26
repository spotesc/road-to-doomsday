"use client";

import Image from "next/image";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LocalRelease } from "@/hooks/use-release";
import { Countdown } from "./countdown";

export function Hero({ release, onShare }: { release: LocalRelease | null; onShare: () => void }) {
  return (
    <header className="relative">
      <div className="relative -mb-32 h-[470px] overflow-hidden sm:-mb-40 sm:h-[clamp(420px,78vh,720px)]">
        <Image
          src="/images/doom.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-breathe object-cover object-[52%_18%]"
        />
        <div className="hero-veil absolute inset-0" />

        <div className="absolute inset-x-0 top-4 z-10 mx-auto flex max-w-4xl items-center justify-between px-4 sm:justify-center">
          <div className="flex items-center gap-2.5 font-display text-xs font-bold tracking-[0.24em] text-white/70 uppercase [text-shadow:0_2px_12px_rgb(0_0_0/0.9)]">
            <span className="rounded border border-white/20 bg-white/10 px-2 py-0.5 tracking-[0.16em] text-white backdrop-blur-sm">
              Spotesc
            </span>
            <span className="h-3 w-px bg-white/30" />
            <span>Watch list</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="rounded-full border-white/20 bg-black/40 backdrop-blur-md hover:border-doom sm:absolute sm:right-4"
            aria-label="Share this list"
          >
            <Share2 />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <Image
          src="/images/marvel.png"
          alt="Marvel"
          width={360}
          height={161}
          priority
          className="mx-auto mb-5 h-auto w-32 rounded-[3px] shadow-[0_8px_34px_rgb(236_29_36/0.42)] sm:w-36"
        />
        <h1 className="font-display text-[clamp(40px,11vw,96px)] leading-[0.9] font-bold tracking-[0.015em] uppercase [text-shadow:0_4px_30px_rgb(0_0_0/0.9)]">
          Road to
          <span className="block animate-glow text-doom text-glow">Doomsday</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground sm:text-[15px]">
          Every film and series to watch before <span className="text-foreground">Avengers: Doomsday</span>, in story
          order. Tick them off as you go.
        </p>
        <Countdown target={release?.at ?? null} />
        <p className="mt-3.5 h-5 font-display text-[13px] font-semibold tracking-[0.24em] text-doom uppercase text-glow">
          {release ? `${release.short} is Doomsday` : ""}
        </p>
      </div>
    </header>
  );
}

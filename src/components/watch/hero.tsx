"use client";

import Image from "next/image";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CinematicAudio } from "@/hooks/use-cinematic-audio";
import type { LocalRelease } from "@/hooks/use-release";
import { AudioCta } from "./audio-control";
import { Countdown } from "./countdown";

const rise = "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-[1400ms] ease-out";

interface Props {
  release: LocalRelease | null;
  audio: CinematicAudio;
  onShare: () => void;
}

export function Hero({ release, audio, onShare }: Props) {
  return (
    <header className="relative isolate">
      <div className="relative h-[100svh] max-h-[1000px] min-h-[760px] overflow-hidden">
        <Image
          src="/images/doom.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-breathe object-cover object-[50%_18%] brightness-[0.9] contrast-[1.08] saturate-[0.85]"
        />
        <div className="hero-veil absolute inset-0" />

        <div className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-6xl items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
          <p className="eyebrow text-[9.5px] text-steel">
            <span className="text-silver">Spotesc</span>
            <span className="mx-3 text-faint">/</span>
            Presents
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            aria-label="Share this list"
            className="h-9 rounded-full border-silver/20 bg-black/40 px-4 font-mono text-[10px] tracking-[0.24em] text-silver uppercase backdrop-blur-md hover:border-silver/45 hover:bg-black/60 hover:text-soft"
          >
            <Share2 />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-4xl px-5 pb-10 text-center sm:pb-14">
          <Image
            src="/images/marvel.png"
            alt="Marvel"
            width={360}
            height={161}
            priority
            className={`mx-auto h-auto w-[78px] rounded-[2px] opacity-95 sm:w-[92px] ${rise}`}
          />
          <p className={`poster-type mt-7 text-[22px] leading-none tracking-[0.55em] text-silver delay-200 sm:text-[26px] ${rise}`}>
            Road to
          </p>
          <h1
            className={`glow-doom mt-3 font-display text-[clamp(54px,14vw,156px)] leading-[0.9] font-bold tracking-[0.035em] delay-500 ${rise}`}
          >
            <span className="text-metal-glint">Doomsday</span>
          </h1>
          <p className={`poster-type mt-5 text-[17px] tracking-[0.24em] text-steel delay-700 sm:text-[20px] ${rise}`}>
            The end is only the beginning.
          </p>
          <div className={`hairline-metal mx-auto mt-6 w-48 delay-700 ${rise}`} />
          <p className={`mx-auto mt-5 max-w-md text-[14px] leading-relaxed text-muted-foreground delay-1000 sm:text-[15px] ${rise}`}>
            Every Marvel film and series, in story order. Tick them off before the lights go down.
          </p>
          <div className={`delay-1000 ${rise}`}>
            <Countdown target={release?.at ?? null} />
          </div>
          <p className={`eyebrow mt-6 h-4 text-[9.5px] text-silver delay-1000 ${rise}`}>
            {release ? `${release.short} — In cinemas${release.region ? ` — ${release.region}` : ""}` : ""}
          </p>
          <div className={`delay-1000 ${rise}`}>
            <AudioCta audio={audio} />
          </div>
        </div>
      </div>
    </header>
  );
}

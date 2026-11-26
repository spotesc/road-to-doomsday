"use client";

import Image from "next/image";
import type { LocalRelease } from "@/hooks/use-release";
import { cn } from "@/lib/utils";
import { BackdropImage } from "./tmdb-image";

interface Props {
  backdrop: string | null | undefined;
  release: LocalRelease | null;
  status: string;
  ready: boolean;
}

export function Finale({ backdrop, release, status, ready }: Props) {
  return (
    <section
      className={cn(
        "relative isolate mt-11 overflow-hidden rounded-[18px] border border-doom/30 bg-[#060a07] px-5 pt-11 pb-10 text-center",
        ready && "shadow-[0_0_70px_rgb(63_224_106/0.18)]"
      )}
    >
      <div className="absolute inset-0 -z-10 opacity-20">
        <BackdropImage path={backdrop} sizes="(max-width: 896px) 100vw, 896px" />
      </div>
      <div className="finale-veil absolute inset-0 -z-10" />
      <Image
        src="/images/avengers.webp"
        alt=""
        width={1456}
        height={819}
        className={cn(
          "pointer-events-none absolute top-1/2 left-1/2 -z-10 w-[150%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-50 mix-blend-screen",
          ready && "animate-pulse"
        )}
      />
      <p className="text-[10.5px] font-bold tracking-[0.3em] text-doom uppercase text-glow">The finish line</p>
      <h2 className="mt-3 font-display text-[clamp(32px,9vw,56px)] leading-none font-bold tracking-[0.02em] uppercase [text-shadow:0_3px_24px_rgb(0_0_0/0.95)]">
        Avengers: Doomsday
      </h2>
      <p className="mt-2.5 text-[13px] text-[#aab4ae] [text-shadow:0_2px_12px_rgb(0_0_0/0.9)]">
        {release ? `${release.region ? `${release.region} · ` : ""}In cinemas ${release.long}` : "In cinemas December 2026"}
        {" · "}Dir. Anthony &amp; Joe Russo · Robert Downey Jr. as Doctor Doom
      </p>
      <p className="mt-4 text-sm font-semibold text-doom">{status}</p>
    </section>
  );
}

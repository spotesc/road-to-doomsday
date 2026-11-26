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
  const credits = [
    { label: "In cinemas", value: release ? `${release.long}${release.region ? ` · ${release.region}` : ""}` : "December 2026" },
    { label: "Directed by", value: "Anthony & Joe Russo" },
    { label: "Doctor Doom", value: "Robert Downey Jr." },
  ];

  return (
    <section
      className={cn(
        "letterbox relative isolate mt-20 overflow-hidden rounded-3xl border border-white/[0.07] px-6 pt-16 pb-14 text-center sm:mt-28 sm:pt-20 sm:pb-16",
        ready && "border-jade/35 shadow-[0_0_80px_-10px_rgb(61_220_132/0.3)]"
      )}
    >
      <div className="absolute inset-0 -z-10 opacity-35">
        <BackdropImage path={backdrop} sizes="(max-width: 1024px) 100vw, 1024px" />
      </div>
      <div className="finale-veil absolute inset-0 -z-10" />

      <Image
        src="/images/avengers.webp"
        alt=""
        width={1456}
        height={819}
        className={cn(
          "mx-auto aspect-square w-[190px] rounded-full object-cover drop-shadow-[0_0_40px_rgb(61_220_132/0.35)] [mask-image:radial-gradient(circle,#000_57%,transparent_70%)] sm:w-[240px]",
          ready && "animate-pulse"
        )}
      />

      <p className="eyebrow mt-8 text-[10px] text-gold">The finish line</p>
      <h2 className="mt-4 font-display text-[clamp(34px,7.5vw,76px)] leading-none font-semibold tracking-[0.035em]">
        <span className="text-metal">Avengers: Doomsday</span>
      </h2>
      <div className="hairline-gold mx-auto mt-7 w-44" />

      <dl className="mx-auto mt-7 grid max-w-md gap-4">
        {credits.map((c) => (
          <div key={c.label}>
            <dt className="eyebrow text-[8.5px] tracking-[0.3em] text-faint">{c.label}</dt>
            <dd className="mt-1.5 font-display text-[15px] tracking-[0.06em] text-steel">{c.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-9 text-sm font-medium text-jade">{status}</p>
    </section>
  );
}

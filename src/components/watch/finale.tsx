"use client";

import Image from "next/image";
import { motion } from "motion/react";
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
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative isolate mt-24 overflow-hidden rounded-3xl border border-white/[0.07] px-6 pt-20 pb-16 text-center sm:mt-32 sm:pt-24 sm:pb-20",
        ready && "border-mint/30 shadow-[0_0_90px_-10px_rgb(60_130_105/0.35)]"
      )}
    >
      <div className="absolute inset-0 -z-10 opacity-30">
        <BackdropImage path={backdrop} sizes="(max-width: 1024px) 100vw, 1024px" className="saturate-[0.6]" />
      </div>
      <div className="finale-veil absolute inset-0 -z-10" />

      <Image
        src="/images/avengers.webp"
        alt=""
        width={1456}
        height={819}
        className={cn(
          "mx-auto aspect-square w-[180px] rounded-full object-cover opacity-90 saturate-[0.85] drop-shadow-[0_0_50px_rgb(60_130_105/0.45)] [mask-image:radial-gradient(circle,#000_57%,transparent_70%)] sm:w-[230px]",
          ready && "animate-pulse"
        )}
      />

      <p className="poster-type mt-10 flex items-center justify-center gap-4 text-[18px] tracking-[0.4em] text-silver sm:text-[22px]">
        <span className="h-px w-8 bg-crimson shadow-[0_0_10px_rgb(113_28_37/0.9)] sm:w-12" />
        One last stand.
        <span className="h-px w-8 bg-crimson shadow-[0_0_10px_rgb(113_28_37/0.9)] sm:w-12" />
      </p>
      <h2 className="glow-doom mt-5 font-display text-[clamp(36px,7.5vw,82px)] leading-[0.95] font-semibold tracking-[0.035em]">
        <span className="text-metal-glint">Avengers: Doomsday</span>
      </h2>
      <div className="hairline-metal mx-auto mt-8 w-48" />

      <dl className="mx-auto mt-8 grid max-w-md gap-5">
        {credits.map((c) => (
          <div key={c.label}>
            <dt className="eyebrow text-[8.5px] tracking-[0.34em] text-steel">{c.label}</dt>
            <dd className="mt-2 font-display text-[15px] tracking-[0.08em] text-silver">{c.value}</dd>
          </div>
        ))}
      </dl>

      <p className="eyebrow mt-10 text-[9.5px] tracking-[0.24em] text-mint">{status}</p>
    </motion.section>
  );
}

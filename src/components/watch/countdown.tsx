"use client";

import { Fragment, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { pad } from "@/lib/format";
import { cn } from "@/lib/utils";

function onSecondBoundaries(notify: () => void) {
  let timer = 0;
  const schedule = () => {
    timer = window.setTimeout(() => {
      notify();
      schedule();
    }, 1000 - (Date.now() % 1000) + 2);
  };
  schedule();
  return () => window.clearTimeout(timer);
}

const everyMinute = (notify: () => void) => {
  const timer = window.setInterval(notify, 60_000);
  return () => window.clearInterval(timer);
};

export function useNowSeconds() {
  return useSyncExternalStore(onSecondBoundaries, () => Math.floor(Date.now() / 1000), () => null);
}

export function useNowMinutes() {
  const minutes = useSyncExternalStore(everyMinute, () => Math.floor(Date.now() / 60_000), () => null);
  return minutes === null ? null : minutes * 60_000;
}

const UNITS = [
  { key: "d", label: "Days" },
  { key: "h", label: "Hours" },
  { key: "m", label: "Minutes" },
  { key: "s", label: "Seconds" },
] as const;

function Digits({ value }: { value: string }) {
  return (
    <span className="inline-flex overflow-hidden">
      {value.split("").map((digit, i) => (
        <span key={`${value.length}-${i}`} className="relative inline-block w-[0.62em] text-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={digit}
              initial={{ y: "-55%", opacity: 0, filter: "blur(3px)" }}
              animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
              exit={{ y: "55%", opacity: 0, filter: "blur(3px)" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="text-metal inline-block"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

export function Countdown({ target }: { target: Date | null }) {
  const now = useNowSeconds();
  let values: Record<string, string> | null = null;
  let left = 0;

  if (target && now !== null) {
    left = Math.max(0, Math.floor(target.getTime() / 1000) - now);
    let rest = left;
    const d = Math.floor(rest / 86400);
    rest %= 86400;
    const h = Math.floor(rest / 3600);
    rest %= 3600;
    values = { d: pad(d), h: pad(h), m: pad(Math.floor(rest / 60)), s: pad(rest % 60) };
  }

  const urgent = values !== null && left < 7 * 86400;
  const secondInMinute = values ? 59 - Number(values.s) : -1;

  return (
    <div className="relative mx-auto mt-9 max-w-[560px]" role="timer" aria-label="Time until Avengers: Doomsday">
      <div className="flex items-center justify-center gap-4">
        <span className="hairline-metal h-px w-10 sm:w-16" />
        <p className={cn("eyebrow text-[9.5px] tracking-[0.38em]", urgent ? "text-[#c98a92]" : "text-steel")}>
          {urgent ? "Time is running out" : "The countdown to Doomsday"}
        </p>
        <span className="hairline-metal h-px w-10 sm:w-16" />
      </div>

      <div className="relative mt-5">
        {now !== null && (
          <span
            key={now}
            aria-hidden
            className="pointer-events-none absolute inset-x-[15%] -inset-y-6 rounded-full bg-[radial-gradient(closest-side,rgb(60_130_105/0.35),transparent)] opacity-0 [animation:tick-pulse_0.9s_ease-out]"
          />
        )}
        <div className="relative flex items-stretch justify-center">
          {UNITS.map((unit, i) => (
            <Fragment key={unit.key}>
              {i > 0 && (
                <span aria-hidden className="relative mx-1 w-px self-stretch bg-gradient-to-b from-transparent via-silver/35 to-transparent sm:mx-2">
                  <span className="absolute top-[38%] left-1/2 size-[3px] -translate-x-1/2 rounded-full bg-silver/50" />
                </span>
              )}
              <div className="flex-1 px-1.5 sm:px-3">
                <span className="block font-mono text-[clamp(40px,10.5vw,82px)] leading-none font-light tracking-[-0.02em] tabular-nums [text-shadow:0_2px_24px_rgb(0_0_0/0.8)]">
                  {values ? <Digits value={values[unit.key]} /> : <span className="text-faint">––</span>}
                </span>
                <span className="eyebrow mt-3 block text-[8.5px] tracking-[0.32em] text-steel">{unit.label}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      <div aria-hidden className="mx-auto mt-6 flex h-3 max-w-[420px] items-end justify-between px-1">
        {Array.from({ length: 60 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "w-px rounded-full transition-[background,box-shadow,height] duration-500",
              i % 5 === 0 ? "h-3 bg-silver/35" : "h-1.5 bg-silver/15",
              i === secondInMinute && "h-3 bg-mint shadow-[0_0_8px_rgb(143_191_170/0.9)]",
              i < secondInMinute && i % 5 !== 0 && "bg-silver/25"
            )}
          />
        ))}
      </div>
    </div>
  );
}

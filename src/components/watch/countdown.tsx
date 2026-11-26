"use client";

import { Fragment, useSyncExternalStore } from "react";
import { pad } from "@/lib/format";

const everySecond = (onTick: () => void) => {
  const timer = window.setInterval(onTick, 1000);
  return () => window.clearInterval(timer);
};

const everyMinute = (onTick: () => void) => {
  const timer = window.setInterval(onTick, 60_000);
  return () => window.clearInterval(timer);
};

export function useNowSeconds() {
  return useSyncExternalStore(everySecond, () => Math.floor(Date.now() / 1000), () => null);
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

export function Countdown({ target }: { target: Date | null }) {
  const now = useNowSeconds();
  let values: Record<string, string> | null = null;

  if (target && now !== null) {
    let left = Math.max(0, Math.floor(target.getTime() / 1000) - now);
    const d = Math.floor(left / 86400);
    left %= 86400;
    const h = Math.floor(left / 3600);
    left %= 3600;
    values = { d: pad(d), h: pad(h), m: pad(Math.floor(left / 60)), s: pad(left % 60) };
  }

  return (
    <div
      role="timer"
      aria-label="Time until Avengers: Doomsday"
      className="mx-auto mt-8 flex max-w-[440px] items-stretch justify-center"
    >
      {UNITS.map((unit, i) => (
        <Fragment key={unit.key}>
          {i > 0 && <span className="w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />}
          <div className="flex-1 px-2 sm:px-4">
            <span
              className={`block text-[40px] leading-none font-extralight tabular-nums sm:text-[54px] ${unit.key === "s" ? "text-jade" : "text-foreground"}`}
            >
              {values ? values[unit.key] : "––"}
            </span>
            <span className="eyebrow mt-2.5 block text-[8.5px] tracking-[0.28em] text-faint">{unit.label}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

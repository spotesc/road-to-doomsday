"use client";

import { useSyncExternalStore } from "react";
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
  { key: "h", label: "Hrs" },
  { key: "m", label: "Min" },
  { key: "s", label: "Sec" },
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
    values = { d: String(d), h: pad(h), m: pad(Math.floor(left / 60)), s: pad(left % 60) };
  }

  return (
    <div className="mt-6 flex justify-center gap-2 sm:gap-2.5" role="timer" aria-label="Time until Avengers: Doomsday">
      {UNITS.map((unit) => (
        <div
          key={unit.key}
          className="w-[74px] rounded-xl border bg-card/80 py-2.5 backdrop-blur-md sm:w-[88px] sm:py-3"
        >
          <span className="block font-display text-[28px] leading-none font-bold tabular-nums sm:text-[34px]">
            {values ? values[unit.key] : "–"}
          </span>
          <span className="mt-1.5 block text-[9.5px] tracking-[0.16em] text-faint uppercase">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

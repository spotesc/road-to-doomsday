"use client";

import { useEffect, useRef, useState } from "react";
import { AudioLines, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CinematicAudio } from "@/hooks/use-cinematic-audio";
import { cn } from "@/lib/utils";

function Bars({ live }: { live: boolean }) {
  return (
    <span aria-hidden className="flex h-3 items-end gap-[2px]">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn("w-[2px] origin-bottom rounded-full bg-silver/70", live ? "h-3" : "h-1")}
          style={live ? { animation: `audio-bar ${1.1 + i * 0.27}s ease-in-out ${i * 0.15}s infinite` } : undefined}
        />
      ))}
    </span>
  );
}

export function AudioCta({ audio }: { audio: CinematicAudio }) {
  const on = audio.state === "on";
  const label =
    audio.state === "off"
      ? "Enable cinematic audio"
      : audio.state === "armed"
        ? "Resume cinematic audio"
        : on
          ? "Cinematic audio on"
          : "Cinematic audio muted";

  return (
    <button
      type="button"
      onClick={audio.state === "off" || audio.state === "armed" ? audio.enable : audio.toggleMute}
      aria-pressed={on}
      className={cn(
        "group relative mx-auto mt-7 inline-flex h-10 items-center gap-3 rounded-full border px-5 font-mono text-[10px] font-medium tracking-[0.3em] uppercase transition-[border-color,background,color,box-shadow] duration-500",
        on
          ? "border-mint/30 bg-doom/40 text-soft shadow-[0_0_30px_-6px_rgb(60_130_105/0.6)]"
          : "border-silver/25 bg-black/40 text-silver backdrop-blur-md hover:border-silver/50 hover:text-soft hover:shadow-[0_0_30px_-8px_rgb(184_184_184/0.4)]"
      )}
    >
      {on ? <Bars live /> : <AudioLines className="size-3.5" />}
      {label}
    </button>
  );
}

export function AudioDock({ audio }: { audio: CinematicAudio }) {
  const active = audio.state === "on" || audio.state === "muted";
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const keepOpen = () => {
    setOpen(true);
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 4000);
  };

  useEffect(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
  }, []);

  return (
    <div
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 sm:right-6 sm:bottom-6"
      onMouseEnter={() => active && keepOpen()}
    >
      <div className="panel flex h-11 items-center rounded-full bg-black/70 px-1.5">
        {active ? (
          <>
            <div
              className={cn(
                "overflow-hidden transition-[width,opacity,padding] duration-500 ease-out",
                open ? "w-28 pr-2 pl-3 opacity-100 sm:w-32" : "w-0 opacity-0"
              )}
            >
              <Slider
                value={[Math.round(audio.volume * 100)]}
                max={100}
                step={1}
                onValueChange={([v]) => {
                  keepOpen();
                  audio.setVolume(v / 100);
                }}
                aria-label="Cinematic audio volume"
                tabIndex={open ? 0 : -1}
                className="[&_[data-slot=slider-range]]:bg-silver [&_[data-slot=slider-thumb]]:border-silver [&_[data-slot=slider-thumb]]:bg-soft [&_[data-slot=slider-track]]:bg-white/10"
              />
            </div>
            <button
              type="button"
              onClick={() => (open ? setOpen(false) : keepOpen())}
              aria-label={open ? "Hide volume" : "Show volume"}
              aria-expanded={open}
              className="grid h-8 place-items-center rounded-full px-2.5 transition-colors hover:bg-white/[0.06]"
            >
              <Bars live={audio.state === "on"} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={audio.enable}
            className="hidden pr-1 pl-3 font-mono text-[9.5px] tracking-[0.26em] text-silver uppercase transition-colors hover:text-soft sm:block"
          >
            {audio.state === "armed" ? "Tap to resume audio" : "Cinematic audio"}
          </button>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={active ? audio.toggleMute : audio.enable}
              aria-label={
                audio.state === "on" ? "Mute cinematic audio" : audio.state === "muted" ? "Unmute cinematic audio" : "Enable cinematic audio"
              }
              className="grid size-8 place-items-center rounded-full text-silver transition-colors hover:bg-white/[0.08] hover:text-soft"
            >
              {audio.state === "on" ? <Volume2 className="size-4" /> : audio.state === "muted" ? <VolumeX className="size-4" /> : <AudioLines className="size-4" />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {audio.state === "on" ? "Mute" : audio.state === "muted" ? "Unmute" : "Enable cinematic audio"}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

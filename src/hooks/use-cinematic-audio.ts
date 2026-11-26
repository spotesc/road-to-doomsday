"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStored } from "@/hooks/use-stored";
import { DoomAudio } from "@/lib/doom-audio";

interface AudioPrefs {
  enabled: boolean;
  muted: boolean;
  volume: number;
}

export type AudioState = "off" | "armed" | "on" | "muted";

export interface CinematicAudio {
  state: AudioState;
  volume: number;
  enable: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

const DEFAULT_PREFS: AudioPrefs = { enabled: false, muted: false, volume: 0.6 };

export function useCinematicAudio(target: Date | null): CinematicAudio {
  const [prefs, setPrefs] = useStored<AudioPrefs>("road-to-doomsday:audio", DEFAULT_PREFS);
  const engine = useRef<DoomAudio | null>(null);
  const starting = useRef(false);
  const [live, setLive] = useState(false);
  const targetMs = target?.getTime() ?? null;

  const enable = useCallback(async () => {
    if (starting.current) return;
    starting.current = true;
    try {
      if (!engine.current) engine.current = new DoomAudio();
      if (targetMs !== null) engine.current.setTarget(targetMs);
      await engine.current.start(prefs.volume);
      setLive(true);
      setPrefs((current) => ({ ...current, enabled: true, muted: false }));
    } catch {
      setLive(false);
    } finally {
      starting.current = false;
    }
  }, [prefs.volume, setPrefs, targetMs]);

  const toggleMute = useCallback(() => {
    if (!live) {
      enable();
      return;
    }
    const muted = !prefs.muted;
    engine.current?.setMuted(muted);
    setPrefs((current) => ({ ...current, muted }));
  }, [live, prefs.muted, enable, setPrefs]);

  const setVolume = useCallback(
    (volume: number) => {
      engine.current?.setVolume(volume);
      if (prefs.muted && volume > 0 && live) engine.current?.setMuted(false);
      setPrefs((current) => ({ ...current, volume, muted: volume > 0 ? false : current.muted }));
    },
    [live, prefs.muted, setPrefs]
  );

  useEffect(() => {
    if (targetMs !== null) engine.current?.setTarget(targetMs);
  }, [targetMs]);

  useEffect(() => {
    if (live || !prefs.enabled || prefs.muted) return;
    const resume = () => enable();
    window.addEventListener("pointerdown", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });
    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, [live, prefs.enabled, prefs.muted, enable]);

  useEffect(() => () => engine.current?.destroy(), []);

  const state: AudioState = live
    ? prefs.muted
      ? "muted"
      : "on"
    : prefs.enabled
      ? prefs.muted
        ? "muted"
        : "armed"
      : "off";

  return { state, volume: prefs.volume, enable, toggleMute, setVolume };
}

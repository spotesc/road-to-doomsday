"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = () => listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function readRaw(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useStored<T>(key: string, fallback: T): [T, (next: T | ((current: T) => T)) => void] {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null
  );

  // fallback is a constant default for each caller
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(() => parse(raw, fallback), [raw]);

  const set = useCallback(
    (next: T | ((current: T) => T)) => {
      const value = typeof next === "function" ? (next as (current: T) => T)(parse(readRaw(key), fallback)) : next;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {}
      listeners.forEach((l) => l());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  return [value, set];
}

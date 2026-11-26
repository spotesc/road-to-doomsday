"use client";

import { useEffect, useRef } from "react";

interface Mote {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
  tint: string;
}

const TINTS = ["232, 232, 232", "184, 184, 184", "143, 191, 170"];

export function Atmosphere() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let motes: Mote[] = [];
    let frame = 0;
    let last = performance.now();

    const spawn = (anywhere: boolean): Mote => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 10,
      r: 0.4 + Math.random() * 1.3,
      vy: 4 + Math.random() * 10,
      sway: 6 + Math.random() * 18,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.05 + Math.random() * 0.22,
      tint: TINTS[Math.random() < 0.3 ? 2 : Math.random() < 0.5 ? 1 : 0],
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(60, (width * height) / 26000));
      motes = Array.from({ length: count }, () => spawn(true));
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, width, height);
      for (const m of motes) {
        m.y -= m.vy * dt;
        m.phase += dt * 0.35;
        if (m.y < -10) Object.assign(m, spawn(false));
        const x = m.x + Math.sin(m.phase) * m.sway;
        const fade = Math.min(1, m.y / (height * 0.25), (height - m.y) / (height * 0.15) + 0.2);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${m.tint}, ${Math.max(0, m.alpha * fade)})`;
        ctx.arc(x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />;
}

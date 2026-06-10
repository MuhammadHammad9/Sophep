"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Target: GIMUN 25 — December 5, 2026
const DEADLINE = new Date("2026-12-05T09:00:00");

function getTimeLeft(): TimeLeft {
  const diff = DEADLINE.getTime() - Date.now();
  if (diff <= 0) return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  return {
    months: Math.floor(diff / (1000 * 60 * 60 * 24 * 30)),
    days: Math.floor((diff / (1000 * 60 * 60 * 24)) % 30),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Pad({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center flex-1 min-w-[55px] md:min-w-[75px]">
      <div className="relative w-full aspect-[1.1] flex items-center justify-center bg-[var(--surface)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden group hover:border-[var(--color-primary)]/40 transition-colors duration-500">
        {/* Subtle internal top glow */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-fg-subtle)] to-transparent" />
        
        {/* Active hover neon glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.12),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <span
          className="font-display font-semibold tabular-nums text-[var(--color-fg)] z-10 tracking-tight"
          style={{
            fontSize: "clamp(1.25rem, 3.2vw, 2.5rem)",
          }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span
        className="font-sans text-[7px] md:text-[9px] uppercase tracking-[0.25em] font-medium mt-3 text-center text-[var(--color-fg-muted)]"
      >
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const initTimer = setTimeout(() => setTime(getTimeLeft()), 0);
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => {
      clearTimeout(initTimer);
      clearInterval(id);
    };
  }, []);

  if (!time) return null;

  return (
    <div className="flex items-start justify-center gap-1.5 md:gap-3 w-full" aria-label="Countdown to GIMUN 25">
      <Pad value={time.months} label="Months" />
      <div className="font-sans font-light text-lg md:text-2xl text-[var(--color-primary)]/30 self-center translate-y-[-10px] select-none">:</div>
      <Pad value={time.days} label="Days" />
      <div className="font-sans font-light text-lg md:text-2xl text-[var(--color-primary)]/30 self-center translate-y-[-10px] select-none">:</div>
      <Pad value={time.hours} label="Hours" />
      <div className="font-sans font-light text-lg md:text-2xl text-[var(--color-primary)]/30 self-center translate-y-[-10px] select-none">:</div>
      <Pad value={time.minutes} label="Minutes" />
      <div className="font-sans font-light text-lg md:text-2xl text-[var(--color-primary)]/30 self-center translate-y-[-10px] select-none">:</div>
      <Pad value={time.seconds} label="Seconds" />
    </div>
  );
}

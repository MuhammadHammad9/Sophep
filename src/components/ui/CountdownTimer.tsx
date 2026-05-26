"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Target: GIMUN 25 — December 5, 2026
const DEADLINE = new Date("2026-12-05T09:00:00");

function getTimeLeft(): TimeLeft {
  const diff = DEADLINE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Pad({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="font-sans font-extralight tabular-nums leading-none tracking-tight"
        style={{
          fontSize: "clamp(2rem, 5vw, 4rem)",
          color: "var(--color-fg)",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span
        className="font-sans text-[9px] uppercase tracking-[0.3em] font-light mt-3"
        style={{ color: "var(--color-fg-muted)" }}
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
    <div className="flex items-start justify-center gap-6 md:gap-12" aria-label="Countdown to GIMUN 25">
      <Pad value={time.days} label="Days" />
      <div className="font-sans font-extralight text-3xl md:text-5xl" style={{ color: "#333" }}>:</div>
      <Pad value={time.hours} label="Hours" />
      <div className="font-sans font-extralight text-3xl md:text-5xl" style={{ color: "#333" }}>:</div>
      <Pad value={time.minutes} label="Minutes" />
      <div className="font-sans font-extralight text-3xl md:text-5xl" style={{ color: "#333" }}>:</div>
      <Pad value={time.seconds} label="Seconds" />
    </div>
  );
}

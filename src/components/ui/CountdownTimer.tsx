"use client";

import React, { useState, useEffect, useRef } from "react";

/* ─── Types ───────────────────────────────────────────────────────────── */
interface TimeLeft {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/* ─── Config ──────────────────────────────────────────────────────────── */
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

/* ─── Rolling Digit ──────────────────────────────────────────────────── */
function RollingDigit({ digit }: { digit: string }) {
  const [current, setCurrent] = useState(digit);
  const [previous, setPrevious] = useState(digit);
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (digit !== current) {
      setPrevious(current);
      setCurrent(digit);
      setAnimating(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setAnimating(false);
      }, 480);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digit]);

  return (
    <div
      style={{
        position: "relative",
        width: "1.1em",
        height: "1.45em",
        overflow: "hidden",
        fontSize: "clamp(1.4rem, 3.5vw, 2.6rem)",
      }}
    >
      {/* Previous digit — scrolls UP and fades out */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-display), sans-serif",
          fontWeight: 700,
          color: "var(--color-fg)",
          fontVariantNumeric: "tabular-nums",
          WebkitFontSmoothing: "antialiased",
          transform: animating ? "translateY(-100%)" : "translateY(0)",
          opacity: animating ? 0 : 1,
          transition: animating
            ? "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease"
            : "none",
        }}
      >
        {animating ? previous : current}
      </span>

      {/* New digit — rolls IN from below */}
      {animating && (
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 700,
            color: "var(--color-fg)",
            fontVariantNumeric: "tabular-nums",
            WebkitFontSmoothing: "antialiased",
            animation: "digit-roll-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {current}
        </span>
      )}
    </div>
  );
}


/* ─── Time Pad (one unit: Months, Days, etc.) ────────────────────────── */
function TimePad({
  value,
  label,
  max,
  delay,
  isSeconds,
}: {
  value: number;
  label: string;
  max: number;
  delay: number;
  isSeconds?: boolean;
}) {
  const [entered, setEntered] = useState(false);
  const [pulse, setPulse] = useState(false);
  const prevValue = useRef(value);
  const digits = String(value).padStart(2, "0").split("");

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  // Pulse effect on value change
  useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div
      className="flex flex-col items-center flex-1"
      style={{
        minWidth: "clamp(48px, 11vw, 82px)",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0) scale(1)" : "translateY(22px) scale(0.92)",
        filter: entered ? "blur(0px)" : "blur(6px)",
        transition:
          "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.7s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Digit Card */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "100%",
          aspectRatio: "1 / 1.08",
          borderRadius: "var(--radius-xl)",
          background:
            "linear-gradient(145deg, var(--color-bg-overlay) 0%, var(--color-bg-raised) 100%)",
          border: `1px solid ${pulse ? "var(--color-primary)" : "var(--color-border)"}`,
          boxShadow: pulse
            ? "0 0 24px var(--color-primary-glow), var(--shadow-glow), inset 0 1px 0 var(--color-border)"
            : "var(--shadow-glow), inset 0 1px 0 var(--color-border)",
          transition: "border-color 0.35s ease, box-shadow 0.35s ease",
          overflow: "hidden",
        }}
      >
        {/* Glass shimmer overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, var(--color-border) 0%, transparent 45%, var(--color-primary-glow) 100%)",
            borderRadius: "inherit",
          }}
        />

        {/* Top edge highlight */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 15%, var(--color-border-hover) 50%, transparent 85%)",
          }}
        />

        {/* Center hinge line — split-flap effect */}
        <div
          className="absolute left-2 right-2 pointer-events-none"
          style={{
            top: "50%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, var(--color-border) 25%, var(--color-border-hover) 50%, var(--color-border) 75%, transparent)",
            transform: "translateY(-50%)",
            zIndex: 15,
          }}
        />

        {/* Rolling Digits */}
        <div className="flex items-center gap-[1px] z-10">
          {digits.map((d, i) => (
            <RollingDigit key={i} digit={d} />
          ))}
        </div>

        {/* Tick-pulse ring (only on seconds pad) */}
        {isSeconds && pulse && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "inherit",
              border: "1px solid var(--color-primary)",
              animation: "tick-pulse 0.6s ease-out forwards",
            }}
          />
        )}
      </div>

      {/* Label */}
      <span
        className="font-sans uppercase tracking-[0.25em] font-medium mt-2 text-center"
        style={{
          fontSize: "clamp(6px, 1.4vw, 9px)",
          color: isSeconds && pulse ? "var(--color-primary)" : "var(--color-fg-muted)",
          transition: "color 0.3s ease",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Blinking Separator ─────────────────────────────────────────────── */
function BlinkingSeparator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setVisible((v) => !v), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex flex-col items-center gap-2 self-center select-none"
      style={{ paddingBottom: "16px" }}
    >
      <div
        style={{
          width: "3.5px",
          height: "3.5px",
          borderRadius: "50%",
          background: "var(--color-primary)",
          opacity: visible ? 0.55 : 0.12,
          boxShadow: visible ? "0 0 6px rgba(139,92,246,0.45)" : "none",
          transition: "opacity 0.2s ease, box-shadow 0.2s ease",
        }}
      />
      <div
        style={{
          width: "3.5px",
          height: "3.5px",
          borderRadius: "50%",
          background: "var(--color-primary)",
          opacity: visible ? 0.55 : 0.12,
          boxShadow: visible ? "0 0 6px rgba(139,92,246,0.45)" : "none",
          transition: "opacity 0.2s ease 0.05s, box-shadow 0.2s ease 0.05s",
        }}
      />
    </div>
  );
}


/* ─── Main Timer ─────────────────────────────────────────────────────── */
export default function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  const items = [
    { value: time.months, label: "Months", max: 12 },
    { value: time.days, label: "Days", max: 30 },
    { value: time.hours, label: "Hours", max: 24 },
    { value: time.minutes, label: "Minutes", max: 60 },
    { value: time.seconds, label: "Seconds", max: 60, isSeconds: true },
  ];

  return (
    <div className="w-full">
      <div
        className="flex items-start justify-center gap-1 sm:gap-1.5 md:gap-2.5 w-full"
        aria-label="Countdown to GIMUN 25"
        role="timer"
      >
        {items.map((item, idx) => (
          <React.Fragment key={item.label}>
            {idx > 0 && <BlinkingSeparator />}
            <TimePad
              value={item.value}
              label={item.label}
              max={item.max}
              delay={0.15 + idx * 0.1}
              isSeconds={item.isSeconds}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

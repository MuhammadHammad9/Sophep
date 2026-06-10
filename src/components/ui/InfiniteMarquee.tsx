"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InfiniteMarqueeProps {
  items: readonly string[] | string[];
  speed?: "slow" | "base" | "fast";
  direction?: "left" | "right";
  variant?: "default" | "accent" | "primary";
  className?: string;
}

const SPEED_MAP = {
  slow: "60s",
  base: "40s",
  fast: "20s",
} as const;

const VARIANT_STYLES = {
  default: "border-[var(--color-fg)] bg-[var(--color-bg-raised)] text-[var(--color-fg)]",
  accent: "border-[var(--color-fg)] bg-[var(--color-neo-pink)] text-[var(--color-bg)]",
  primary: "border-[var(--color-fg)] bg-[var(--color-primary)] text-[var(--color-fg)]",
} as const;

export default function InfiniteMarquee({
  items,
  speed = "base",
  direction = "left",
  variant = "default",
  className = "",
}: InfiniteMarqueeProps) {
  const prefersReducedMotion = useReducedMotion();
  const loopItems = [...items, ...items];

  return (
    <div
      className={cn(
        "overflow-hidden py-4 border-y-2",
        VARIANT_STYLES[variant],
        className
      )}
      aria-hidden
    >
      <div
        className={cn(
          "flex whitespace-nowrap will-change-transform translate-z-0",
          prefersReducedMotion ? "" : "marquee-track"
        )}
        style={{
          animationDuration: prefersReducedMotion ? undefined : SPEED_MAP[speed],
          animationDirection: prefersReducedMotion ? undefined : direction === "right" ? "reverse" : "normal",
        }}
      >
        {loopItems.map((item, idx) => (
          <div
            key={`${item}-${idx}`}
            className="flex items-center px-8 text-4xl sm:text-6xl md:text-8xl font-display font-extrabold uppercase tracking-tighter shrink-0"
          >
            {item}
            <span className="ml-16 opacity-80" aria-hidden>
              ★
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";

interface InfiniteMarqueeProps {
  items: string[];
  speed?: "slow" | "base" | "fast";
  direction?: "left" | "right";
  className?: string;
}

export default function InfiniteMarquee({
  items,
  speed = "base",
  direction = "left",
  className = "",
}: InfiniteMarqueeProps) {
  const speedMap = {
    slow: "60s",
    base: "40s",
    fast: "20s",
  };

  return (
    <div className={`overflow-hidden py-4 border-y-2 border-[var(--color-fg)] bg-[var(--color-bg-raised)] ${className}`}>
      <div 
        className="flex whitespace-nowrap marquee-track"
        style={{ 
          animationDuration: speedMap[speed],
          animationDirection: direction === "right" ? "reverse" : "normal"
        }}
      >
        {/* Duplicate items for seamless loop */}
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center px-8 text-6xl md:text-8xl font-display font-extrabold uppercase tracking-tighter"
          >
            {item}
            <span className="ml-16 text-[var(--color-primary)]">★</span>
          </div>
        ))}
      </div>
    </div>
  );
}

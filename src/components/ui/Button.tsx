"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "charcoal" | "brutal";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "group relative inline-flex items-center justify-center gap-3 font-display uppercase tracking-wider transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-50 disabled:pointer-events-none overflow-hidden";

    // Replaced standard background changes with inner glow/border expansions
    const variants = {
      primary:
        "bg-transparent text-[var(--color-fg)] font-medium border border-[var(--color-primary)] rounded-[4px]",
      ghost:
        "border border-[rgba(255,255,255,0.08)] text-[var(--color-fg-muted)] font-light bg-transparent hover:text-[var(--color-fg)] rounded-[4px]",
      outline:
        "border border-[rgba(255,255,255,0.08)] text-[var(--color-primary)] font-medium bg-transparent rounded-[4px]",
      charcoal:
        "bg-transparent text-[var(--color-fg-muted)] font-light border border-[rgba(255,255,255,0.08)] rounded-[4px]",
      brutal:
        "bg-[var(--color-fg)] text-[var(--color-bg)] font-black border-2 border-[var(--color-fg)] shadow-brutal hover:shadow-brutal-hover active:shadow-none hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150",
    };

    const sizes = {
      sm:  "px-5 py-2.5 text-[10px]",
      md:  "px-7 py-3.5 text-[12px]",
      lg:  "px-9 py-4 text-[14px]",
      xl:  "px-11 py-5 text-[16px]",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {/* Inner glow / Fill element that fades in on hover instead of instant background swap */}
        {variant === "primary" && (
          <div className="absolute inset-0 bg-[var(--color-primary)] opacity-10 group-hover:opacity-100 transition-opacity duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
        )}
        {(variant === "outline" || variant === "charcoal" || variant === "ghost") && (
          <div className="absolute inset-0 border border-transparent group-hover:border-[rgba(255,255,255,0.3)] transition-colors duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-0 rounded-[4px]" />
        )}
        
        <span className="relative z-10 flex items-center gap-3">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

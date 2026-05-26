"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

export default function TextScramble({ 
  text, 
  className = "", 
  delay = 0,
  duration = 0.8 
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isInView && !hasStarted) {
      const timer = setTimeout(() => {
        setHasStarted(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasStarted, delay]);

  useEffect(() => {
    if (!hasStarted) return;

    let iteration = 0;
    const intervalTime = (duration * 1000) / (text.length * 2.5);
    
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 2.5;
    }, intervalTime);

    return () => clearInterval(interval);
  }, [hasStarted, text, duration]);

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  );
}

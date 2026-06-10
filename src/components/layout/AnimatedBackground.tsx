"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  r: number; isHub: boolean; pulse: number; pulseDir: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let animId: number;

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const N = 35;
    const MAX_DIST_SQ = 130 * 130;
    const particles: Particle[] = Array.from({ length: N }, (_, i) => {
      const isHub = i < 5;
      return {
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * (isHub ? 0.12 : 0.22),
        vy: (Math.random() - 0.5) * (isHub ? 0.12 : 0.22),
        r: isHub ? 2.8 : Math.random() * 1.4 + 0.4,
        isHub, pulse: Math.random(), pulseDir: Math.random() > 0.5 ? 1 : -1,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        if (p.isHub) {
          p.pulse += p.pulseDir * 0.007;
          if (p.pulse > 1 || p.pulse < 0) p.pulseDir *= -1;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 22);
          g.addColorStop(0, "rgba(46,117,182,0.18)");
          g.addColorStop(1, "rgba(46,117,182,0)");
          ctx.beginPath(); ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
        }

        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(46,117,182,${p.isHub ? 0.55 + p.pulse * 0.35 : 0.28})`;
        ctx.fill();
      }

      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < MAX_DIST_SQ) {
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          }
        }
      }
      ctx.strokeStyle = "rgba(46,117,182,0.08)";
      ctx.lineWidth = 0.6; 
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}

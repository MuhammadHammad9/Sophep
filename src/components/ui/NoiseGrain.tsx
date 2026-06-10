"use client";

import React from "react";

export default function NoiseGrain() {
  return (
    <div 
      className="fixed inset-0 z-[1] pointer-events-none opacity-[0.025] mix-blend-soft-light"
      style={{
        backgroundImage: "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.08) 0, transparent 35%), radial-gradient(circle at 80% 10%, rgba(0,240,255,0.05) 0, transparent 30%), url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAB+/v6IiIjo6OjQ0NDy8vKMjIwAAACUeA/VAAAAAXRSTlMAQObYZgAAAIlJREFUOMuVlTEOQDAMQg2y9x+yV+mSJ0x06Ex/ZNuK4i/7I2tV61K0Z4xG2I0YFmIwxkgMh/EYjDEQw2EM1hj2IwaHMRhjeBwxcGzEIIzBMd3jIIaHMRBjcBwjMRzGIIzBGIyBGA5jIMbAEcNhDMRwGIMwBsZgjIEYDmMgxsARw2EMxHAYgzAG5hM3WfJb1QAAAABJRU5ErkJggg==\")",
        backgroundRepeat: "repeat",
        backgroundSize: "auto, auto, 72px 72px"
      }}
    />
  );
}

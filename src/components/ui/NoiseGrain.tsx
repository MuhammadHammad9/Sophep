"use client";

import React from "react";

export default function NoiseGrain() {
  return (
    <div 
      className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.04]"
      style={{
        backgroundImage: "url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAB+/v6IiIjo6OjQ0NDy8vKMjIwAAACUeA/VAAAAAXRSTlMAQObYZgAAAIlJREFUOMuVlTEOQDAMQg2y9x+yV+mSJ0x06Ex/ZNuK4i/7I2tV61K0Z4xG2I0YFmIwxkgMh/EYjDEQw2EM1hj2IwaHMRhjeBwxcGzEIIzBMd3jIIaHMRBjcBwjMRzGIIzBGIyBGA5jIMbAEcNhDMRwGIMwBsZgjIEYDmMgxsARw2EMxHAYgzAG5hM3WfJb1QAAAABJRU5ErkJggg==\")",
        backgroundRepeat: "repeat",
        backgroundSize: "64px 64px"
      }}
    />
  );
}

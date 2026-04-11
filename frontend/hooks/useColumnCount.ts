"use client";

import { useState, useEffect } from "react";

const BREAKPOINTS: { min: number; cols: number }[] = [
  { min: 1280, cols: 5 },
  { min: 1024, cols: 4 },
  { min: 768, cols: 3 },
  { min: 0, cols: 2 },
];

/**
 * Returns a responsive column count based on window width.
 * SSR-safe — defaults to 2 until hydrated.
 */
export function useColumnCount(): number {
  const [cols, setCols] = useState(2);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      const bp = BREAKPOINTS.find((b) => w >= b.min);
      setCols(bp?.cols ?? 2);
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cols;
}

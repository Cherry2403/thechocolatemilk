import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Map to CSS variables set by Next.js fonts
        serif: ["var(--font-cormorant)", "serif"],  // Headings — Cormorant Garamond
        sans: ["var(--font-inter)", "sans-serif"],  // Body — Inter
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
};

export default config;

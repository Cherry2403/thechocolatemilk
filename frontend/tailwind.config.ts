import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "var(--color-cream)",
        bg: "var(--color-bg)",
        white: "var(--color-white)",
        text: "var(--color-text)",
        grey: "var(--color-grey)",
        green: "var(--color-green)",
        "green-light": "var(--color-green-light)",
        "light-brown": "var(--color-light-brown)",
        "dark-brown": "var(--color-dark-brown)",
        "cream-pink": "var(--color-cream-pink)",
        "light-pink": "var(--color-light-pink)",
        "butter-yellow": "var(--color-butter-yellow)",
        "dark-red": "var(--color-dark-red)",
      },
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

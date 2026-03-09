import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        // App backgrounds
        "app-bg": "#0A0A0C",
        "sidebar-bg": "#0F0F12",
        "card-bg": "#16161A",
        "card-hover": "#1C1C22",
        "active-bg": "#1E1E26",
        "input-bg": "#13131A",

        // Borders
        "border-subtle": "rgba(255,255,255,0.055)",
        "border-medium": "rgba(255,255,255,0.09)",
        "border-strong": "rgba(255,255,255,0.14)",

        // Text
        "text-primary": "#EDEDED",
        "text-secondary": "#7A7A85",
        "text-muted": "#4A4A55",

        // Accent
        "accent-blue": "#4361EE",
        "accent-blue-dim": "rgba(67,97,238,0.18)",
        "accent-purple": "#7C3AED",

        // Priority
        "priority-high": "#EF4444",
        "priority-high-bg": "rgba(239,68,68,0.12)",
        "priority-medium": "#F97316",
        "priority-medium-bg": "rgba(249,115,22,0.12)",
        "priority-low": "#22C55E",
        "priority-low-bg": "rgba(34,197,94,0.12)",

        // Tag
        "tag-saas": "#3B82F6",
        "tag-saas-bg": "rgba(59,130,246,0.15)",
      },
      borderRadius: {
        "app": "20px",
        "card": "14px",
        "pill": "100px",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
        "sidebar": "1px 0 0 rgba(255,255,255,0.05)",
        "inner-subtle": "inset 0 1px 0 rgba(255,255,255,0.06)",
        "app": "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in": "slideIn 0.25s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

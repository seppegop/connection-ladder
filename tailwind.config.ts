import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Connection Ladder Design System — minimalist, calming, natural
        // Inspired by moodboard UI Kit (connection-ladder-uikit.aura.build)
        brand: {
          50: "#f7f6f4",
          100: "#edeae6",
          200: "#ddd8d0",
          300: "#c4bcb2",
          400: "#a89f92",
          500: "#94897b",
          600: "#8a7e6f",
          700: "#73685c",
          800: "#60564d",
          900: "#4f4740",
          950: "#2a2622",
        },
        accent: {
          50: "#f0f7f4",
          100: "#d9ebe3",
          200: "#b6d7c9",
          300: "#8bbda8",
          400: "#649f84",
          500: "#45836b",
          600: "#356a56",
          700: "#2c5647",
          800: "#26463b",
          900: "#223b33",
          950: "#102119",
        },
        surface: {
          DEFAULT: "#faf9f7",
          muted: "#f5f3f0",
          elevated: "#ffffff",
        },
        ink: {
          DEFAULT: "#2a2622",
          muted: "#60564d",
          subtle: "#8a7e6f",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(42, 38, 34, 0.06)",
        card: "0 4px 12px rgba(42, 38, 34, 0.08)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "challenge-fade": {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translate(-50%, 12px)" },
          "100%": { opacity: "1", transform: "translate(-50%, 0)" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.5s ease-in-out infinite",
        "challenge-fade": "challenge-fade 0.3s ease-out",
        "toast-in": "toast-in 0.35s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;

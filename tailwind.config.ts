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
        // Moodboard UI Kit — Neobrutalism palette
        // Semantic aliases for backward compatibility
        brand: {
          50: "#FDFBF7",
          100: "#fef3c7",   // amber-100
          200: "#e9d5ff",   // purple-200
          300: "#d8b4fe",   // purple-300
          400: "#c084fc",   // purple-400
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
          950: "#3b0764",
        },
        accent: {
          50: "#f0fdf4",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",   // emerald-300 (mint green)
          400: "#34d399",
          500: "#000000",   // primary dark (black)
          600: "#000000",
          700: "#000000",
          800: "#000000",
          900: "#000000",
          950: "#000000",
        },
        surface: {
          DEFAULT: "#FDFBF7",
          muted: "#f5f5f4",
          elevated: "#ffffff",
        },
        ink: {
          DEFAULT: "#000000",
          muted: "#1f2937",  // gray-800
          subtle: "#4b5563", // gray-600
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        // Neobrutalism shadows (matching UI-Kit.html)
        "neo-xs": "2px 2px 0px 0px rgba(0,0,0,1)",
        "neo-sm": "4px 4px 0px 0px rgba(0,0,0,1)",
        "neo-md": "6px 6px 0px 0px rgba(0,0,0,1)",
        "neo-lg": "8px 8px 0px 0px rgba(0,0,0,1)",
        // Legacy (keep for any remaining refs)
        soft: "0 2px 8px rgba(0, 0, 0, 0.06)",
        card: "0 4px 12px rgba(0, 0, 0, 0.08)",
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
        "emoji-fade-in": {
          "0%": { opacity: "0.5", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translate(-50%, 12px)" },
          "100%": { opacity: "1", transform: "translate(-50%, 0)" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.5s ease-in-out infinite",
        "challenge-fade": "challenge-fade 0.3s ease-out",
        "emoji-fade-in": "emoji-fade-in 0.3s ease-in-out",
        "toast-in": "toast-in 0.35s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;

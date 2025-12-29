import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#006BFF", // Calendly-like blue
          dark: "#0053CC",
          light: "#EAF2FF",
        },
        surface: "#FFFFFF",
        muted: "#F8FAFC",
        border: "#E5E7EB",
        text: "#0F172A",
        subtle: "#64748B",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06)",
        lift: "0 12px 40px rgba(0,0,0,0.12)",
      },
      animation: {
        fadeUp: "fadeUp 0.4s ease-out",
        fadeIn: "fadeIn 0.3s ease-out",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

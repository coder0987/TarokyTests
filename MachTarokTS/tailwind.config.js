/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: "true",
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        green: "#98ad99",
        red: "#9D181D",
        white: "#f5f3f1",
        whiteHover: "#e2dfdc",
        black: "#342D27",
        tan: "#E3D6B2",
        blue: "#0d6efd",
        navy: "#1f3855",
        gray: "#777777",
        "red-error": "#7f1d1d",
        "green-success": "#1d7f1d",
        "toast-success": "#DFF2BF",
        "toast-error": "#FFBABA",
        "success-text": "#4F8A10",
        "error-text": "#D8000C",
        "toast-neutral": "#D3D3D3",
        "neutral-text": "#4A4A4A",
      },
      screens: {
        xs: "480px",
      },
      width: {
        420: "420px",
        465: "465px",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        mono: ["Menlo", "Monaco", "Courier New", "monospace"],
      },
      fontSize: {
        xxs: "0.625rem",
        xxxs: "0.5rem",
        xxxxs: "0.375rem",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        flash: {
          "0%, 100%": {
            color: "#ff0000",
          },
          "50%": {
            color: "#ffffff",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        flash: "flash 1s ease-in-out 3",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

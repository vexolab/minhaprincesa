/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 20px 64px rgba(177, 72, 107, 0.22)",
        soft: "0 18px 54px rgba(5, 3, 6, 0.22)",
        gold: "0 16px 48px rgba(240, 201, 122, 0.18)",
        luxury: "0 32px 96px rgba(4, 2, 5, 0.36), 0 8px 32px rgba(4, 2, 5, 0.18)",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Iowan Old Style", "Baskerville", "Palatino Linotype", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        rose: {
          luxury: "#e8a0b8",
          deep: "#9a3a5a",
        },
        gold: {
          warm: "#f0c97a",
          pale: "#fde8b0",
        },
      },
    },
  },
  plugins: [],
};

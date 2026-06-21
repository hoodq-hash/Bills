/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        elite: {
          bg: "#08080d",
          surface: "#0f0f16",
          card: "#16161f",
          border: "#2a2a35",
          gold: "#C5A059",
          "gold-light": "#d4b36a",
          "gold-dark": "#a8863f",
          muted: "#9a9aa8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

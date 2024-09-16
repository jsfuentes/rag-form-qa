/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        black: "#000000",
        sticky: "#FFFFFF",
        primary: {
          50: "#F9F7FF",
          100: "#F3EEFF",
          200: "#E6DDFF",
          300: "#D9CCFF",
          400: "#B38AFF",
          500: "#8206FF",
          600: "#6805CC",
          700: "#4E0499",
          800: "#340266",
          900: "#1A0133",
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primaryGreen: "#22c55e"
      },
      fontFamily: {
        sans: ["'Inter'", "sans-serif"]
      }
    },
  },
  plugins: [],
}
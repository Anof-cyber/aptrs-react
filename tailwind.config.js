/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  daisyui: {
    themes: ["corporate", "forest"],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}


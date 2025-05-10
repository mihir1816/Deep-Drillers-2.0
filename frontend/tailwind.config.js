/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  darkMode: 'class', // This line is required for dark mode to work
  theme: {
    extend: {},
  },
  plugins: [],
}
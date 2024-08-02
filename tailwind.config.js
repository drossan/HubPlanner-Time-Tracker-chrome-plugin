/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '300px': '18.75rem',
      }
    }
  },
  plugins: [],
}
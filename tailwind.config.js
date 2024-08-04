/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '400px': '400px',
      },
      height: {
        '450px': '450px',
      }
    }
  },
  plugins: [],
}
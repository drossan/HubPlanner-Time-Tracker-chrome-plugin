/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      width: {
        '400px': '400px',
      },
      height: {
        '500px': '500px',
      },
      maxHeight: {
        '250px': '250px',
      }
    }
  },
  plugins: [],
}


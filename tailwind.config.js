/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#7A1515',
          light: '#8B1515',
          hover: '#A01C1C',
        },
        cream: '#F0EDE6',
        dark: '#1A1A1A',
      },
      fontFamily: {
        heading: ['"League Spartan"', 'Anton', 'sans-serif'],
        body: ['"League Spartan"', 'Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

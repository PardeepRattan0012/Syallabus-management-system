/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0b120c", // Deep Tactical Green (Background)
        secondary: "#6b863a", // Olive Drab (Buttons/Highlights)
        accent: "#c3b091", // Desert Khaki (Accents)
        // Custom "Army Grey" scale overriding the default 'slate'
        slate: {
          50: '#f4f6f3',
          100: '#e0e6dd',
          200: '#c2cfbd',
          300: '#9cb195',
          400: '#758e6b',
          500: '#58714f',
          600: '#43583c',
          700: '#354630',
          800: '#2d3a29',
          900: '#263023',
          950: '#131911',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

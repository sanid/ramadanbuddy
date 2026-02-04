/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#13eca4",
        "accent-gold": "#FFD700",
        "background-light": "#f6f8f7",
        "background-dark": "#10221c",
        "nav-bg": "#152a23",
      },
      fontFamily: {
        "display": ["Lexend", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1.25rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}

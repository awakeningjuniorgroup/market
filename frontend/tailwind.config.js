// tailwind.config.js
import { Config } from 'tailwindcss'

/** @type {Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // ← important pour React/Vite
  ],
  theme: {
    extend: {
      colors: {
        "rabbit-red": "#AAB1Bf",
      },
    },
  },
  plugins: [],
}

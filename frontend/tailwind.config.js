// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom Dark Palette
        'dark-bg': '#1e293b',     // Slate-800 / Main Background
        'dark-card': '#334155',   // Slate-700 / Card/Component Background
        'dark-text': '#f1f5f9',   // Slate-100 / Primary Text Color
        'accent-blue': '#60a5fa', // Blue-400 / Highlight/Primary Action
        'accent-green': '#34d399',// Emerald-400 / Completed Status
        'accent-yellow': '#facc15',// Amber-400 / Ongoing Status
      },
    },
  },
  darkMode: 'class', // Enable dark mode using class toggle
  plugins: [],
}


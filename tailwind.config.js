/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617', // slate-950
        surface: '#0f172a',    // slate-900
        surfaceHighlight: '#1e293b', // slate-800
        primary: '#38bdf8',    // sky-400
        secondary: '#818cf8',  // indigo-400
        success: '#22c55e',
        danger: '#ef4444',
        textMain: '#f8fafc',   // slate-50
        textMuted: '#94a3b8',  // slate-400
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 60px -15px rgba(15, 23, 42, 0.85)',
      },
    },
  },
  plugins: [],
}

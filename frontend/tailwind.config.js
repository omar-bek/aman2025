/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors - UAE Government Grade (Emerald/Teal focus)
        primary: {
          50: '#CCFBF1',
          100: '#99F6E4',
          200: '#5EEAD4',
          300: '#2DD4BF',
          400: '#14B8A6',
          500: '#0D9488',
          600: '#0F766E',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // UAE Design System - Sand backgrounds
        sand: {
          50: '#FAF9F6',
          100: '#F5F3ED',
          200: '#F0ECE4',
          300: '#E8E0D0',
          400: '#E0D5BD',
          500: '#D4C8B0',
          600: '#C4B599',
        },
        // UAE Design System - Emerald accents
        emerald: {
          50: '#D1FAE5',
          100: '#A7F3D0',
          200: '#6EE7B7',
          300: '#34D399',
          400: '#10B981',
          500: '#059669',
          600: '#047857',
          700: '#065F46',
        },
        // UAE Design System - Teal accents
        teal: {
          50: '#CCFBF1',
          100: '#99F6E4',
          200: '#5EEAD4',
          300: '#2DD4BF',
          400: '#14B8A6',
          500: '#0D9488',
          600: '#0F766E',
          700: '#115E59',
        },
        // Status colors
        status: {
          safe: '#10B981',
          safeBg: '#D1FAE5',
          info: '#F59E0B',
          infoBg: '#FEF3C7',
          action: '#EF4444',
          actionBg: '#FEE2E2',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'Inter', 'Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'card': '12px',
        'card-lg': '16px',
        'badge': '20px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'soft': '0 1px 3px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}





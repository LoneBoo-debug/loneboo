/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx",
  ],
  theme: {
    extend: {
      colors: {
        'boo-purple': '#8B5CF6',
        'boo-orange': '#F97316',
        'boo-green': '#10B981',
        'boo-yellow': '#FBBF24',
        'boo-blue': '#3B82F6',
      },
      fontFamily: {
        sans: ['"Fredoka"', 'sans-serif'],
        cartoon: ['"Titan One"', 'cursive'],
        luckiest: ['"Luckiest Guy"', 'cursive'],
        digital: ['"Share Tech Mono"', 'monospace'],
      },
      animation: {
        'spin-horizontal': 'spin-h 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'spin-h': { '0%': { transform: 'rotateY(0deg)' }, '100%': { transform: 'rotateY(360deg)' } },
        'float': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

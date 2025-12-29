/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        header: ['"Press Start 2P"', 'cursive'],
        body: ['VT323', 'monospace'],
        mono: ['Courier New', 'monospace']
      },
      colors: {
        primary: {
          DEFAULT: '#ffd700',
          dark: '#1a0b2e',
          purple: '#2d1b4e'
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      boxShadow: {
        'pixel': '4px 4px 0px #000',
        'pixel-lg': '8px 8px 0px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 20px rgba(255, 215, 0, 0.5)'
      }
    },
  },
  plugins: [],
}

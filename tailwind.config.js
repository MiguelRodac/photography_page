/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f0',
          100: '#f9eddb',
          200: '#f3d9b2',
          300: '#ebbf7f',
          400: '#e2a04e',
          500: '#d4892e',
          600: '#bd7023',
          700: '#9e561f',
          800: '#7f461f',
          900: '#6a3b1d',
          950: '#3a1d0d',
        },
        surface: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'parallax': 'parallax 20s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        parallax: {
          '0%': { transform: 'scale(1.05) translateY(0)' },
          '100%': { transform: 'scale(1) translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

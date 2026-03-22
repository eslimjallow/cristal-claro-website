/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff8ff',
          100: '#dbeefe',
          200: '#bfe3fd',
          300: '#93d0fb',
          400: '#5fb3f6',
          500: '#3b94e8',
          600: '#2576d4',
          700: '#1f5fb0',
          800: '#1e508f',
          900: '#1e4473',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        chat: '0 8px 40px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};

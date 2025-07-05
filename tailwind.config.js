/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6BA16D',
        secondary: '#EAE6DA', 
        accent: '#B7C9A9',
        nature: {
          50: '#f6f8f6',
          100: '#e3f0e4',
          200: '#c7e0c9',
          300: '#9bc9a0',
          400: '#6BA16D',
          500: '#4f8a52',
          600: '#3d6d40',
          700: '#335735',
          800: '#2c472e',
          900: '#263d27',
        }
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        title: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
}
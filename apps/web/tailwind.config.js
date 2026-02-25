/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#E8F0FB',
          100: '#C5D5F5',
          500: '#1E4D8C',
          600: '#1A4279',
          700: '#153564',
        },
        success: { 500: '#2E7D32', 100: '#E8F5E9' },
        warning: { 500: '#E65100', 100: '#FFF8E1' },
        danger:  { 500: '#C62828', 100: '#FFEBEE' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

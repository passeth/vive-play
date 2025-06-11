/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF1EB',
          100: '#FFE3D7',
          200: '#FFC8B0',
          300: '#FFA988',
          400: '#FF8952',
          500: '#FF6720',
          600: '#E0520A',
          700: '#B84100',
          800: '#8F3200',
          900: '#662500',
        },
        secondary: {
          50: '#F3F5FC',
          100: '#E7ECF9',
          200: '#D0D9F3',
          300: '#B8C5ED',
          400: '#A1B2E7',
          500: '#8FA0D8',
          600: '#7180C1',
          700: '#5A69AE',
          800: '#45528D',
          900: '#313C6C',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #FF6720, #8FA0D8)',
      },
    },
  },
  plugins: [],
};
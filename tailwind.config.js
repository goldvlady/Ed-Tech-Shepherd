/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryGray: '#6E7682',
        secondaryGray: '#585F68',
        dark: '#212224',

        primaryColor: '#072D5F',

        secondaryBlue: '#207DF7',
        primaryBlue: '#207DF7',
        lightGreen: '#F4FAF5',

        success: '#4CAF50',
        error700: '#FEF0F0',
        error: '#F53535',
      },
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Inter', 'serif'],
    },
    backgroundImage: {
      'profile-pattern': "url('/public/patterns/profile-pattern.svg')",
    },
  },
  plugins: [],
};

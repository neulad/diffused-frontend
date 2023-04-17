/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      space: ['Space Mono', 'monospace'],
    },
    screens: {
      xs: '360px',
      ss: '460px',
      sm: '680px',
      md: '768px',
      tablet: '894px',
      wider: '1142px',
      xwider: '1620px',
    },
    extend: {},
  },
  plugins: [],
};

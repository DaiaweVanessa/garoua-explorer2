/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: '#1E2A4A',
          light: '#2E3F68',
          dark: '#141D34',
        },
        laterite: {
          DEFAULT: '#B8551F',
          light: '#D06B32',
          dark: '#8F4118',
        },
        savane: {
          DEFAULT: '#E8C468',
          light: '#F0D68C',
          dark: '#CDA841',
        },
        sable: {
          DEFAULT: '#F4EEDD',
          light: '#FAF6EC',
          dark: '#E8DFC4',
        },
        benoue: {
          DEFAULT: '#4A6B4E',
          light: '#5F8264',
          dark: '#37503A',
        },
        ink: '#211C14',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Manrope"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};

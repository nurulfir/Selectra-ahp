/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        softblue: {
          100: '#a2d2ff',
          200: '#80caff',
          300: '#5ec2ff',
        },
      },
      backgroundImage: {
        'soft-gradient': 'linear-gradient(to right, #06b6d4, #3b82f6)',
      },
    },
  },
  plugins: [],
}

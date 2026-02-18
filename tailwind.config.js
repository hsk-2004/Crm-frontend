/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#080c10',
          card: '#0f1419',
          border: '#1a1f27',
        },
      },
      fontFamily: {
        bebas: ["'Bebas Neue'", 'sans-serif'],
        dmsans: ["'DM Sans'", 'sans-serif'],
        dmmono: ["'DM Mono'", 'monospace'],
      },
    },
  },
  plugins: [],
};

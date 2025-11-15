// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(51, 51, 51)',
          dark: 'rgb(17, 17, 17)',
          light: 'rgb(87, 87, 87)'
        },
        accent: 'rgb(255, 217, 0)',
      },
      fontFamily: {
        serif: ["Georgia", "'Times New Roman'", "Times", "serif"],
      },
      fontSize: {
        base: '20px',
      },
      spacing: {
        'nav-item': '10px 20px',
      },
      borderRadius: {
        'nav': '10px',
      },
      zIndex: {
        'nav': '1000',
      },
      minHeight: {
        'screen': '100vh',
      },
    },
  },
  plugins: [],
}
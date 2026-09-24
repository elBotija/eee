/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.js",
  ],
  corePlugins: {
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}

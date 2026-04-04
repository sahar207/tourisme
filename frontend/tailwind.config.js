/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{html,hbs,js}",
    "./public/**/*.{html,js}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

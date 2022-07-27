/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: colors.zinc["900"],
        default: colors.zinc["300"],
        border: colors.zinc["600"],
        shadow: "#141417",
        accent: colors.cyan["900"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}

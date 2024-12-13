/** @type {import('tailwindcss').Config} */
const daisyui = require("daisyui");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "-primary": "#fcfcfc",
        "-secondary": "#212D2E",
        "-tertiary": "#2D4F64",
        "-quaternary": "#A28D51",
        "-background": "#E8E8E8",
      },
    },
  },
  plugins: [daisyui],
};

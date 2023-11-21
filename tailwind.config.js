/** @type {import('tailwindcss').Config} */
const daisyUIThemes = require("daisyui/src/theming/themes");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        garden: {                          // Extending the garden theme
           ...daisyUIThemes["[data-theme=garden]"],
           primary: "#ff0050"
        },
      },
    ],

  },

}


const { colors } = require("tailwindcss/defaultTheme");

module.exports = {
  purge: {
    content: ["src/site/**/*.njk"],
  },
  theme: {
    extend: {},
    fontFamily: {
      display: ['"Fira Sans"', "sans-serif"],
      body: ['"Spectral"', "serif"],
      mono: ['"IBM Plex Mono"', "monospace"],
    },
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      red: colors.red,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue,
      indigo: colors.indigo,
      purple: colors.purple,
    },
  },
  variants: {},
  plugins: [],
};

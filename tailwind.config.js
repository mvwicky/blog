const { colors } = require("tailwindcss/defaultTheme");

const ratio = 1.2;
const base = 16;

/** @param {number} n */
function msPixels(n) {
  return Math.pow(ratio, n) * base;
}

/** @param {number} n */
function ms(n) {
  const rem = (msPixels(n) / 16).toFixed(3);

  return `${rem}rem`;
}

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
    fontSizes: {
      xs: "0.694rem",
      sm: "0.833rem",
      base: "1rem",
      lg: "1.2rem",
      xl: "1.44rem",
      "2xl": "1.728rem",
      "3xl": "2.074rem",
      "4xl": "2.488rem",
      "5xl": "2.986rem",
      "6xl": "3.583rem",
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

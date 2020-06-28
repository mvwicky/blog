const { colors } = require("tailwindcss/defaultTheme");

const ratio = 1.2; /* Minor Third */
const base = 16; /* Pixels */

/** @param {number} n */
function msPixels(n) {
  return Math.pow(ratio, n) * base;
}

/**
 * @param  {number} rem
 * @param  {number} precision
 * @return {string}
 */
function normalizeRem(rem, precision = 3) {
  const fixed = rem.toFixed(precision);
  return fixed;
}

/** @param {number} n */
function ms(n) {
  const rem = msPixels(n) / 16;
  return `${normalizeRem(rem)}rem`;
}

module.exports = {
  purge: {
    content: ["src/_site/**/*.njk", "src/_site/**/*.md"],
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
    container: {
      padding: {
        default: "1.5rem",
        lg: "18rem",
      },
    },
  },
  variants: {},
  plugins: [],
};

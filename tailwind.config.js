const { colors } = require("tailwindcss/defaultTheme");

const MS_RATIO = 1.2; /* Minor Third */
const MS_BASE = 16; /* Pixels */

/** @param {number} n */
function msPixels(n) {
  return Math.pow(MS_RATIO, n) * MS_BASE;
}

/**
 * @param  {number} rem
 * @param  {number} precision
 * @return {string}
 */
function normalizeRem(rem, precision = 3) {
  // if (Math.trunc(rem) === rem) {
  //   return String(rem);
  // }
  const fixed = rem.toFixed(precision);
  const match = fixed.match(/(\d+\.[1-9]*)0+/);
  if (match !== null) {
    const f = match[1];
    if (f.endsWith(".")) {
      return f.substring(0, f.length - 1);
    } else {
      return f;
    }
  }
  return fixed;
}

/** @param {number} n */
function ms(n) {
  const rem = msPixels(n) / 16;
  return `${normalizeRem(rem)}rem`;
}

console.log(ms(16));

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
    fontSize: {
      xs: ms(-1),
      sm: ms(-1),
      base: ms(0),
      lg: ms(1),
      xl: ms(2),
      "2xl": ms(3),
      "3xl": ms(4),
      "4xl": ms(5),
      "5xl": ms(6),
      "6xl": ms(7),
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
        lg: ms(15),
      },
    },
  },
  variants: {},
  plugins: [],
};

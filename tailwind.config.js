const { colors } = require("tailwindcss/defaultTheme");

const MS_RATIO = 1.2; /* Minor Third */
const MS_BASE = 16; /* Pixels */
const TRAILING_RE = /(\d+\.[1-9]*)0+$/;

/** @param {number} n */
function msPixels(n) {
  return Math.pow(MS_RATIO, n) * MS_BASE;
}

/**
 * @param  {number} rem - A font size in rem
 * @param  {number} precision - Decimal places
 * @return {string}
 */
function normalizeRem(rem, precision = 3) {
  const fixed = rem.toFixed(precision);
  const match = TRAILING_RE.exec(fixed);
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

const config = {
  purge: {
    content: ["site/**/*.njk", "site/**/*.md"],
  },
  theme: {
    extend: {},
    fontFamily: {
      display: ['"Fira Sans"', "sans-serif"],
      body: ['"Spectral"', "serif"],
      mono: ['"IBM Plex Mono"', "monospace"],
    },
    fontSize: {
      xs: ms(-2),
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
        lg: ms(16),
      },
    },
  },
  variants: {},
  plugins: [],
};

module.exports = config;

const { colors, fontFamily } = require("tailwindcss/defaultTheme");

const {
  config: {
    ui: { breakpoints: BREAKPOINTS, ms: MS },
  },
} = require("./package.json");

const breakpoints = Object.fromEntries(
  Object.entries(BREAKPOINTS).map(([sz, px]) => [sz, `${px}px`])
);

/** @type {Intl.NumberFormatOptions} */
const LOCALE_OPTS = { maximumFractionDigits: 3, useGrouping: false };

/**
 * Calculate single threaded modular-scale value.
 * @param {number} n
 * @param {number} ratio
 * @param {number} base
 * @returns {number}
 */
function msPixels(n, ratio = MS.ratio, base = MS.base) {
  return Math.pow(ratio, n) * base;
}

/**
 * @param  {number} rem - A font size in rem
 * @param  {number} precision - Decimal places
 * @returns {string}
 */
function normalizeRem(rem, precision = 3) {
  /** @type {Intl.NumberFormatOptions} */
  const opts = { maximumFractionDigits: precision, ...LOCALE_OPTS };
  return rem.toLocaleString(undefined, opts);
}

/**
 * @param {number} n
 * @returns {string}
 */
function ms(n) {
  const rem = msPixels(n) / 16;
  return `${normalizeRem(rem)}rem`;
}

const config = {
  purge: {
    mode: "layers",
    content: ["site/**/*.njk", "site/**/*.md"],
  },
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fira Sans"', ...fontFamily.sans],
        body: ['"Spectral"', ...fontFamily.serif],
      },
      screens: {
        print: { raw: "print" },
      },
    },
    fontFamily: {
      sans: ['"Fira Sans"', ...fontFamily.sans],
      serif: ['"Spectral"', ...fontFamily.serif],
      mono: ['"IBM Plex Mono"', ...fontFamily.mono],
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
    colors,
    container: {
      center: true,
      padding: {
        DEFAULT: ms(-1),
        md: ms(2),
        lg: ms(12),
        xl: ms(16),
      },
    },
    screens: breakpoints,
  },
  // darkMode: "media",
  variants: {},
  plugins: [],
};

module.exports = config;

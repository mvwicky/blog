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

const firaFamily = ['"Fira Sans"', ...fontFamily.sans];
const spectralFamily = ['"Spectral"', ...fontFamily.serif];
const plexFamily = ['"IBM Plex Mono"', ...fontFamily.mono];

const config = {
  purge: {
    mode: "layers",
    content: ["site/**/*.{njk,md}"],
  },
  theme: {
    extend: {
      fontFamily: {
        display: firaFamily,
        body: spectralFamily,
      },
      screens: {
        print: { raw: "print" },
      },
    },
    fontFamily: {
      sans: firaFamily,
      serif: spectralFamily,
      mono: plexFamily,
    },
    fontSize: {
      xs: ms(-2),
      sm: ms(-1),
      base: [ms(0), { lineHeight: "1.5rem" }],
      lg: ms(1),
      xl: ms(2),
      "2xl": ms(3),
      "3xl": ms(4),
      "4xl": ms(5),
      "5xl": [ms(6), { lineHeight: "1" }],
      "6xl": [ms(7), { lineHeight: "1" }],
      "7xl": [ms(8), { lineHeight: "1" }],
      "8xl": [ms(10), { lineHeight: "1" }],
      "9xl": [ms(11), { lineHeight: "1" }],
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

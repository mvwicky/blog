const { colors, fontFamily } = require("tailwindcss/defaultTheme");

const [MS_RATIO, MS_BASE] = [1.2 /* Minor Third */, 16 /* Pixels */];

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
  const match = fixed.match(TRAILING_RE);
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
        default: ms(-1),
        md: ms(2),
        lg: ms(16),
      },
    },
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
  },
  variants: {},
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};

module.exports = config;

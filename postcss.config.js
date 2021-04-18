const tailwindJIT = require("@tailwindcss/jit");
const postcssImport = require("postcss-import");

const { env } = require("./build/lib");

const plugins = [postcssImport, tailwindJIT];

if (env.PROD) {
  const csso = require("postcss-csso");
  /** @type {import("csso").MinifyOptions} */
  const cssoOptions = {};
  const autoprefixer = require("autoprefixer");
  plugins.push(autoprefixer({ flexbox: "no-2009" }));
  plugins.push(csso(cssoOptions));
}

module.exports = { plugins };

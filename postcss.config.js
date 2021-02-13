const postcssImport = require("postcss-import");
const tailwindcss = require("tailwindcss");

const { env } = require("./build/lib");

const plugins = [postcssImport, tailwindcss];

if (env.PROD) {
  /** @type {import("csso").MinifyOptions} */
  const cssoOptions = {};
  const csso = require("postcss-csso");
  const autoprefixer = require("autoprefixer");
  plugins.push(autoprefixer({ flexbox: "no-2009" }));
  plugins.push(csso(cssoOptions));
}

module.exports = { plugins };

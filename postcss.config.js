const postcssImport = require("postcss-import");
const tailwindcss = require("tailwindcss");

const { env } = require("./build/lib");

const plugins = [postcssImport, tailwindcss];

if (env.PROD) {
  const cssnano = require("cssnano");
  const autoprefixer = require("autoprefixer");
  plugins.push(autoprefixer({ flexbox: "no-2009" }));
  plugins.push(cssnano({ preset: "default" }));
}

module.exports = { plugins, map: { inline: false } };

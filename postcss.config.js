const prod = process.env.NODE_ENV === "production";

const plugins = [
  require("postcss-import"),
  require("postcss-mixins"),
  require("tailwindcss"),
];

if (prod) {
  const cssnano = require("cssnano");
  const autoprefixer = require("autoprefixer");
  plugins.push(autoprefixer({ flexbox: "no-2009" }));
  plugins.push(cssnano({ preset: "default" }));
}

module.exports = { plugins };

const prod = process.env.NODE_ENV === "production";

const plugins = [
  require("postcss-import"),
  require("postcss-mixins"),
  require("tailwindcss"),
  require("autoprefixer"),
];

if (prod) {
  plugins.push(require("cssnano"));
}

module.exports = { plugins };

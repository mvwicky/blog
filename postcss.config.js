const plugins = [
  require("postcss-import"),
  require("postcss-mixins"),
  require("tailwindcss"),
  require("autoprefixer"),
];

if (process.env.NODE_ENV === "production") {
  plugins.push(
    require("@fullhuman/postcss-purgecss")({
      content: ["./src/site/**/*.njk"],
      defaultExtractor: (content) => content.match(/[\w-/.:]+(?<!:)/g) || [],
    })
  );
  plugins.push(require("cssnano"));
}

module.exports = { plugins };

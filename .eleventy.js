const fs = require("fs");
const path = require("path");

const manifestPath = path.resolve(__dirname, "dist", "assets", "manifest.json");
const manifest = JSON.parse(
  fs.readFileSync(manifestPath, { encoding: "utf-8" })
);

module.exports = function (eleventyConfig) {
  eleventyConfig.addLayoutAlias("default", "layouts/default.njk");
  eleventyConfig.addShortcode("webpackAsset", function (name) {
    if (!manifest[name]) {
      throw new Error(`The asset ${name} does not exist in ${manifestPath}`);
    }
    return manifest[name];
  });

  eleventyConfig.addPassthroughCopy({ "src/img": "img" });

  eleventyConfig.setBrowserSyncConfig({
    files: [manifestPath],
    logConnections: true,
  });

  eleventyConfig.addFilter("dump", (obj) => util.inspect(obj));

  return {
    dir: {
      input: "src/site",
      includes: "_includes",
      output: "dist",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};

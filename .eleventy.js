/**
 * @fileoverview Eleventy configuration.
 * @author Michael Van Wickle <me@michaelvanwickle.com>
 */

const fs = require("fs");
const path = require("path");

const yaml = require("js-yaml");
const { Settings } = require("luxon");

const { logger, env } = require("./build/lib");
const collections = require("./config/collections");
const shortcodes = require("./config/shortcodes");
const transforms = require("./config/transforms");
const filters = require("./config/utils/filters");
const pkg = require("./package.json");

const log = logger("11ty", true);

const MANIFEST = path.resolve(__dirname, "dist", "assets", "manifest.json");

function configureMarkdown() {
  const markdownIt = require("markdown-it");

  /** @type {import("markdown-it").Options} */
  const baseCfg = { html: true, typographer: true };
  /** @type {import("markdown-it-anchor").AnchorOptions} */
  const anchorCfg = {
    permalink: true,
    permalinkClass: "permalink-anchor text-gray-700",
    permalinkSymbol: "ǂ",
    permalinkBefore: true,
    level: [4],
    slugify: filters.extraSlug,
  };
  return markdownIt(baseCfg)
    .use(require("markdown-it-footnote"))
    .use(require("markdown-it-anchor"), anchorCfg)
    .use(require("markdown-it-attrs"), {});
}

/**
 * @param {{input: string, includes: string}} dirs - 1tty dir config value
 * @returns {[string, string][]} - Alias names and their relative paths
 */
function layoutAliases(dirs) {
  const includesDir = path.resolve(__dirname, dirs.input, dirs.includes);
  const layoutsDir = path.join(includesDir, "layouts");
  const layoutFiles = fs.readdirSync(layoutsDir, { encoding: "utf-8" });
  const aliases = layoutFiles
    .filter((name) => /\.njk$/.test(name))
    .map((name) => {
      const fullPath = path.join(layoutsDir, name);
      const relPath = path.relative(includesDir, fullPath);
      const baseName = path.basename(fullPath, ".njk");
      return [baseName, relPath];
    });
  return aliases;
}

module.exports = function (eleventyConfig) {
  log("NODE_ENV=%s", env.NODE_ENV);
  Settings.defaultZoneName = "utc";

  const pkgCfg = pkg.config.eleventy;

  layoutAliases(pkgCfg.dir).forEach(([baseName, relPath]) =>
    eleventyConfig.addLayoutAlias(baseName, relPath)
  );

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addDataExtension("yaml", (cts) => yaml.safeLoad(cts));

  const md = configureMarkdown();
  eleventyConfig.setLibrary("md", md);

  // eleventyConfig.addPassthroughCopy("_headers");
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ assets: "blog/assets" });

  eleventyConfig.addWatchTarget(MANIFEST);
  eleventyConfig.setBrowserSyncConfig({
    files: [MANIFEST],
    logConnections: true,
    ghostMode: false,
    ui: false,
    logLevel: "info",
    injectChanges: false,
    port: 11738,
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("dist/404.html");
        browserSync.addMiddleware("*", (req, res) => {
          res.write(content_404); // Provides the 404 content without redirect.
          res.end();
        });
      },
    },
  });

  const assets = shortcodes.configure({
    root: __dirname,
    output: pkgCfg.dir.output,
  });

  eleventyConfig.addShortcode("webpackAsset", assets.webpackAsset);
  eleventyConfig.addShortcode("inlineWebpackAsset", assets.inlineWebpackAsset);

  eleventyConfig.addPairedShortcode("linksection", shortcodes.linksection);

  eleventyConfig.addTransform("critical", transforms.critical);

  Object.entries(filters).forEach(([name, func]) =>
    eleventyConfig.addFilter(name, func)
  );
  eleventyConfig.addFilter("markdownify", (s) => md.render(s));

  Object.entries(collections).forEach(([name, func]) =>
    eleventyConfig.addCollection(name, func)
  );

  eleventyConfig.setQuietMode(false);

  return pkgCfg;
};

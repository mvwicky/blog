/**
 * @fileoverview Eleventy configuration.
 * @author Michael Van Wickle <me@michaelvanwickle.com>
 */

const fs = require("fs");
const { resolve, join, relative, basename } = require("path");

const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const yaml = require("js-yaml");
const { Settings } = require("luxon");

const { logger, env } = require("./build/lib");
const collections = require("./config/collections");
const shortcodes = require("./config/shortcodes");
const transforms = require("./config/transforms");
const filters = require("./config/utils/filters");
const { config, homepage } = require("./package.json");

const log = logger("11ty", true);

function configureMarkdown() {
  const anchor = require("markdown-it-anchor");

  /** @type {import("markdown-it-anchor").LinkAfterHeaderPermalinkOptions} */
  const permalinkCfg = {
    class: "permalink-anchor",
    symbol: "ǂ", // Alveolar (or palatal?) click symbol
    placement: "before",
    style: "visually-hidden",
    assistiveText: (title) => `${title} Permalink`,
    visuallyHiddenClass: "sr-only",
  };
  /** @type {import("markdown-it-anchor").AnchorOptions} */
  const anchorCfg = {
    level: [4],
    slugify: filters.extraSlug,
    permalink: anchor.permalink.linkAfterHeader(permalinkCfg),
  };
  const markdownIt = require("markdown-it");
  return markdownIt({ html: true, typographer: true })
    .use(require("markdown-it-footnote"))
    .use(anchor, anchorCfg)
    .use(require("markdown-it-attrs"), {});
}

/**
 * @param {{input: string, includes: string}} dirs - 1tty dir config value
 * @returns {[string, string][]} - Alias names and their relative paths
 */
function layoutAliases(dirs) {
  const includesDir = resolve(__dirname, dirs.input, dirs.includes);
  const layoutsDir = join(includesDir, "layouts");
  const layoutFiles = fs.readdirSync(layoutsDir, { encoding: "utf-8" });
  const aliases = layoutFiles
    .filter((name) => /\.njk$/.test(name))
    .map((name) => {
      const fullPath = join(layoutsDir, name);
      return [basename(fullPath, ".njk"), relative(includesDir, fullPath)];
    });
  return aliases;
}

module.exports = function (eleventyConfig) {
  log("NODE_ENV=%s", env.NODE_ENV);
  Settings.defaultZoneName = "utc";

  const { eleventy: pkgCfg } = config;
  const outDir = pkgCfg.dir.output;

  for (const [baseName, relPath] of layoutAliases(pkgCfg.dir)) {
    eleventyConfig.addLayoutAlias(baseName, relPath);
  }

  eleventyConfig.addPlugin(sitemap, { sitemap: { hostname: homepage } });

  eleventyConfig.addDataExtension("yaml", (cts) => yaml.load(cts));

  const md = configureMarkdown();
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ assets: "blog/assets" });
  eleventyConfig.addPassthroughCopy({ "src/css/theme/fonts": "fonts" });
  if (env.PROD) {
    eleventyConfig.ignores.add(`${join(pkgCfg.dir.input, "posts", "drafts")}/`);
  }

  const MANIFEST = resolve(__dirname, outDir, "assets", "manifest.json");
  eleventyConfig.addWatchTarget(MANIFEST);
  eleventyConfig.setWatchThrottleWaitTime(250);
  eleventyConfig.setBrowserSyncConfig({
    files: [MANIFEST],
    logConnections: true,
    logLevel: "info",
    injectChanges: false,
    port: 11738,
    callbacks: {
      ready: function (_err, bs) {
        const file_404 = resolve(__dirname, outDir, "404.html");
        const content_404 = fs.readFileSync(file_404);
        bs.addMiddleware("*", (_req, res) => {
          res.statusCode = 404;
          res.write(content_404); // Provides the 404 content without redirect.
          res.end();
        });
      },
    },
    https: {
      key: resolve(__dirname, "localhost+3-key.pem"),
      cert: resolve(__dirname, "localhost+3.pem"),
    },
  });

  const assets = shortcodes.configure({ root: __dirname, output: outDir });
  eleventyConfig.addShortcode("webpackAsset", assets.webpackAsset);
  eleventyConfig.addShortcode("inlineWebpackAsset", assets.inlineWebpackAsset);
  eleventyConfig.addShortcode("proofText", shortcodes.proofText);

  for (const [name, transform] of Object.entries(transforms)) {
    eleventyConfig.addTransform(name, transform);
  }
  for (const [name, filter] of Object.entries(filters)) {
    eleventyConfig.addFilter(name, filter);
  }
  for (const [name, collection] of Object.entries(collections)) {
    eleventyConfig.addCollection(name, collection);
  }

  eleventyConfig.addFilter("markdownify", (s) => md.render(s));

  eleventyConfig.setQuietMode(false);

  return pkgCfg;
};

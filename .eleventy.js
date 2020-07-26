/**
 * @fileoverview Eleventy configuration.
 * @author Michael Van Wickle <me@michaelvanwickle.com>
 */

const fs = require("fs");
const path = require("path");
const util = require("util");

const debug = require("debug");
const yaml = require("js-yaml");
const { Settings } = require("luxon");

const {
  linkDate,
  readableDate,
  htmlDateString,
} = require("./config/utils/dates");
const { linkSection } = require("./config/utils/linksection");
const { shouldShow } = require("./config/utils/should-show");
const pkg = require("./package.json");

const log = debug("blog");
const prod = process.env.NODE_ENV === "production";

const INSPECT_ARGS = { compact: 1, getters: false };
const MANIFEST = path.resolve(__dirname, "dist", "assets", "manifest.json");
const TO_DASH_RE = /(?:\s+)|—/g;
const REM_RE = /[—,.]/g;

/** @returns {Record<string, string | undefined>} */
function manifest() {
  const cts = fs.readFileSync(MANIFEST, { encoding: "utf-8" });
  const m = JSON.parse(cts);
  return m;
}

/**
 * A modified slug.
 *
 * @param {string} s - a string
 * @returns {string}
 */
function extraSlug(s) {
  const lowered = String(s).trim().toLowerCase().normalize();
  const slug = encodeURIComponent(
    lowered.replace(TO_DASH_RE, "-").replace(REM_RE, "")
  );
  return slug;
}

function configureMarkdown() {
  const markdownIt = require("markdown-it");
  const markdownItFootnote = require("markdown-it-footnote");
  const markdownItAnchor = require("markdown-it-anchor");
  const markdownItAttrs = require("markdown-it-attrs");

  /** @type {import("markdown-it").Options} */
  const baseCfg = { html: true, typographer: true };
  /** @type {import("markdown-it-anchor").AnchorOptions} */
  const anchorCfg = {
    permalink: true,
    permalinkClass: "permalink-anchor text-gray-700",
    permalinkSymbol: "ǂ",
    permalinkBefore: true,
    level: [4],
    slugify: extraSlug,
  };
  return markdownIt(baseCfg)
    .use(markdownItFootnote)
    .use(markdownItAnchor, anchorCfg)
    .use(markdownItAttrs, {});
}

/**
 * Link to a build asset.
 *
 * @param {string} name
 */
function webpackAsset(name) {
  const asset = manifest()[name];
  if (!asset) {
    throw new Error(`The asset ${name} does not exist in ${MANIFEST}`);
  }
  return asset;
}

/**
 * @description Inline a build asset
 *
 * @param {string} name - An asset name.
 * @returns {string} - The asset contents, wrapped in an appropriate tag.
 */
function inlineWebpackAsset(name) {
  const asset = manifest()[name];
  if (!asset) {
    throw new Error(`The asset ${name} does not exist in ${MANIFEST}`);
  }
  // @todo: Make this configurable (factory function which returns an inline function)
  const outputDir = path.resolve(__dirname, "dist");
  const assetPath = path.join(outputDir, asset);
  const assetCts = fs.readFileSync(assetPath, { encoding: "utf-8" });
  const ext = path.extname(asset);
  if (ext === ".js") {
    return `<script>${assetCts}</script>`;
  } else if (ext === ".css") {
    return `<style>${assetCts}</style>`;
  } else {
    throw new Error(`Unknown asset type ${ext}`);
  }
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
  Settings.defaultZoneName = "utc";

  const pkgCfg = pkg.config.eleventy;

  layoutAliases(pkgCfg.dir).forEach(([baseName, relPath]) =>
    eleventyConfig.addLayoutAlias(baseName, relPath)
  );

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addDataExtension("yaml", (cts) => yaml.safeLoad(cts));

  const md = configureMarkdown();
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPassthroughCopy("_headers");
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
    // port: 11738,
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("dist/404.html");
        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  eleventyConfig.addShortcode("webpackAsset", webpackAsset);
  eleventyConfig.addShortcode("inlineWebpackAsset", inlineWebpackAsset);

  eleventyConfig.addPairedShortcode("linksection", linkSection);

  eleventyConfig.addFilter("linkDate", linkDate);
  eleventyConfig.addFilter("readableDate", readableDate);
  eleventyConfig.addFilter("htmlDateString", htmlDateString);
  eleventyConfig.addFilter("extraSlug", extraSlug);
  eleventyConfig.addFilter("markdownify", (s) => md.render(s));
  eleventyConfig.addFilter("inspect", (obj) => util.inspect(obj, INSPECT_ARGS));
  eleventyConfig.addFilter("keys", (obj) => Object.keys(obj));
  eleventyConfig.addFilter("shouldShow", shouldShow);

  const published = require("./config/collections/published");
  const tagList = require("./config/collections/tagList");
  eleventyConfig.addCollection("published", published);
  eleventyConfig.addCollection("tagList", tagList);

  eleventyConfig.setQuietMode(false);

  return pkgCfg;
};

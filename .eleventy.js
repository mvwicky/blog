/**
 * @fileoverview Eleventy configuration.
 * @author Michael Van Wickle <me@michaelvanwickle.com>
 */

const fs = require("fs");
const path = require("path");
const util = require("util");

const yaml = require("js-yaml");
const { DateTime, Settings } = require("luxon");

const pkg = require("./package.json");

const prod = process.env.NODE_ENV === "production";

const inspectArgs = {
  compact: 1,
  getters: false,
};

const manifestPath = path.resolve(__dirname, "dist", "assets", "manifest.json");

/** @returns {Record<string, string | undefined>} */
function manifest() {
  const cts = fs.readFileSync(manifestPath, { encoding: "utf-8" });
  const m = JSON.parse(cts);
  return m;
}

const TO_DASH_RE = /(?:\s+)|—/g;
const REM_RE = /[—,.]/g;

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

  const baseCfg = { html: true, typographer: true };
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

/** @param {Date} date - a date */
function linkDate(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const mz = month < 10 ? "0" : "";
  const dz = day < 10 ? "0" : "";
  return `${year}/${mz}${month}/${dz}${day}`;
}

/** @param {Date} date - a date */
function readableDate(date) {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_FULL);
}

/** @param {Date} date - a date */
function htmlDateString(date) {
  return DateTime.fromJSDate(date).toFormat("yyyy-LL-dd");
}

/**
 * Link to a build asset.
 *
 * @param {string} name
 */
function webpackAsset(name) {
  const asset = manifest()[name];
  if (!asset) {
    throw new Error(`The asset ${name} does not exist in ${manifestPath}`);
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
    throw new Error(`The asset ${name} does not exist in ${manifestPath}`);
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

  eleventyConfig.addWatchTarget(manifestPath);
  eleventyConfig.setBrowserSyncConfig({
    files: [manifestPath],
    logConnections: true,
    ghostMode: false,
    ui: false,
    logLevel: "info",
    injectChanges: false,
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
  eleventyConfig.addFilter("linkDate", linkDate);
  eleventyConfig.addFilter("readableDate", readableDate);
  eleventyConfig.addFilter("htmlDateString", htmlDateString);
  eleventyConfig.addFilter("extraSlug", extraSlug);
  eleventyConfig.addFilter("markdownify", (s) => md.render(s));
  eleventyConfig.addFilter("inspect", (obj) => util.inspect(obj, inspectArgs));
  eleventyConfig.addFilter("keys", (obj) => Object.keys(obj));

  eleventyConfig.addCollection("published", require("./config/published"));
  eleventyConfig.addCollection("tagList", require("./config/tagList"));

  eleventyConfig.setQuietMode(false);

  return pkgCfg;
};

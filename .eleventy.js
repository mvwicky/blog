/**
 * @fileoverview Eleventy configuration.
 * @author Michael Van Wickle <me@michaelvanwickle.com>
 */

const fs = require("fs");
const path = require("path");

const yaml = require("js-yaml");
const { DateTime, Settings } = require("luxon");

const pkg = require("./package.json");

const manifestPath = path.resolve(__dirname, "dist", "assets", "manifest.json");

const manifest = () => {
  const cts = fs.readFileSync(manifestPath, { encoding: "utf-8" });
  return JSON.parse(cts);
};

const toDashRe = /(?:\s+)|—/g;
const remRe = /[—,.]/g;

/**
 * @param {string} s - a string
 * @returns {string}
 */
function extraSlug(s) {
  const lowered = String(s).trim().toLowerCase().normalize();
  const slug = encodeURIComponent(
    lowered.replace(toDashRe, "-").replace(remRe, "")
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

/**
 * @param {Date} date - a date
 */
function linkDate(date) {
  // return DateTime.fromJSDate(jsDate).toFormat("yyyy/LL/dd")
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const mz = month < 10 ? "0" : "";
  const dz = day < 10 ? "0" : "";
  return `${year}/${mz}${month}/${dz}${day}`;
}

/**
 * @param {Date} date - a date
 */
function readableDate(date) {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_FULL);
}

/**
 * @param {Date} date - a date
 */
function htmlDateString(date) {
  return DateTime.fromJSDate(date).toFormat("yyyy-LL-dd");
}

/**
 * @param {string} name
 */
function webpackAsset(name) {
  const _manifest = manifest();
  if (!_manifest[name]) {
    throw new Error(`The asset ${name} does not exist in ${manifestPath}`);
  }
  return _manifest[name];
}

module.exports = function (eleventyConfig) {
  Settings.defaultZoneName = "utc";

  const pkgCfg = pkg.config["11ty"];

  const inputDir = pkgCfg.dir.input;
  const includesDir = path.resolve(__dirname, inputDir, pkgCfg.dir.includes);
  const layoutsDir = path.join(includesDir, "layouts");
  const layoutFiles = fs.readdirSync(layoutsDir, { encoding: "utf-8" });
  layoutFiles.forEach((name) => {
    if (/\.njk$/.test(name)) {
      const fullPath = path.join(layoutsDir, name);
      const relPath = path.relative(includesDir, fullPath);
      const baseName = path.basename(fullPath, ".njk");
      eleventyConfig.addLayoutAlias(baseName, relPath);
    }
  });

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addDataExtension("yaml", (cts) => yaml.safeLoad(cts));

  const md = configureMarkdown();
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPassthroughCopy("_headers");
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/js": "/" });
  eleventyConfig.addPassthroughCopy({ assets: "blog/assets" });

  eleventyConfig.addWatchTarget(manifestPath);
  eleventyConfig.setBrowserSyncConfig({
    files: [manifestPath],
    logConnections: true,
    ghostMode: false,
    ui: false,
    logLevel: "info",
    injectChanges: false,
  });

  eleventyConfig.addShortcode("webpackAsset", webpackAsset);
  eleventyConfig.addFilter("linkDate", linkDate);
  eleventyConfig.addFilter("readableDate", readableDate);
  eleventyConfig.addFilter("htmlDateString", htmlDateString);
  eleventyConfig.addFilter("extraSlug", extraSlug);
  eleventyConfig.addFilter("markdownify", (s) => md.render(s));

  return pkgCfg;
};

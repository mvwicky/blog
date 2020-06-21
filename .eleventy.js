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

function configureMarkdown() {
  const markdownIt = require("markdown-it");
  const markdownItFootnote = require("markdown-it-footnote");
  const markdownItAnchor = require("markdown-it-anchor");

  const baseCfg = { html: true, typographer: true };
  const anchorCfg = {
    permalink: true,
    permalinkClass: "permalink-anchor",
    permalinkSymbol: "¤",
    permalinkBefore: true,
    level: [4],
  };
  return markdownIt(baseCfg)
    .use(markdownItFootnote)
    .use(markdownItAnchor, anchorCfg);
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
  return DateTime.fromJSDate(date).toFormat("dd LLL yyyy");
}

/**
 * @param {Date} date - a date
 */
function htmlDateString(date) {
  return DateTime.fromJSDate(date).toFormat("yyyy-LL-dd");
}

/** @param {string} s - a string */
function extraSlug(s) {
  return encodeURIComponent(
    String(s).trim().toLowerCase().replace(/\s+/g, "-")
  );
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

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addDataExtension("yaml", (cts) => yaml.safeLoad(cts));
  eleventyConfig.addLayoutAlias("default", "layouts/default.njk");
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  const md = configureMarkdown();
  eleventyConfig.setLibrary("md", md);

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
  });

  eleventyConfig.addShortcode("webpackAsset", webpackAsset);
  eleventyConfig.addFilter("linkDate", linkDate);
  eleventyConfig.addFilter("readableDate", readableDate);
  eleventyConfig.addFilter("htmlDateString", htmlDateString);
  eleventyConfig.addFilter("extraSlug", extraSlug);
  eleventyConfig.addFilter("markdownify", (s) => md.renderInline(s));

  const pkgCfg = pkg.config["11ty"];

  return {
    ...pkgCfg,
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};

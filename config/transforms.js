const path = require("path");

const critical = require("critical");
const multimatch = require("multimatch");

const { logger } = require("../build/lib");
const { config } = require("../package.json");
const { env } = require("./utils/env");

const log = logger("11ty:transforms", true);
const ROOT_DIR = path.dirname(__dirname);

// const GLOBS_TO_TX = ["dist/index.html", "dist/tags/*/index.html"];
/** @type {string[]} */
const GLOBS_TO_TX = ["dist/index.html", "dist/page/*/index.html"];

/**
 * @param asset {import("../lib").Asset}
 * @returns {string}
 */
function rebase(asset) {
  return asset.url;
}

const criticalConfig = {
  inline: { polyfill: false, preload: false },
  base: path.join(ROOT_DIR, config.eleventy.dir.output),
  dimensions: [{ width: 1200, height: 800 }],
  rebase,
};

/**
 * @param path {string | undefined}
 * @returns {boolean}
 */
function shouldTransform(path) {
  if (!env.production || !path) {
    return false;
  }
  return multimatch([path], GLOBS_TO_TX).length !== 0;
}

/**
 * @param content {string}
 * @param outputPath {string | undefined}
 */
async function transformCritical(content, outputPath) {
  const tx = shouldTransform(outputPath);
  if (tx) {
    log("Extracting critical css from %s", outputPath);
    try {
      const config = { ...criticalConfig, html: content };
      const { html, uncritical, css } = await critical.generate(config);
      const origLength = content.length;
      const txLength = html.length;
      const m = txLength / origLength;
      log("Extracted critical css from %s (%s)", outputPath, m.toFixed(3));
      log("critical: %d, uncritical: %d", css.length, uncritical.length);
      return html;
    } catch (e) {
      console.error(e);
    }
  }
  return content;
}

module.exports = {
  critical: transformCritical,
};

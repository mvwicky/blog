const path = require("path");

const critical = require("critical");
const multimatch = require("multimatch");

const { logger } = require("../build/lib");
const { formatSize } = require("../build/lib/helpers");
const {
  config: {
    critical: { globs, dimensions },
    eleventy,
  },
} = require("../package.json");
const { env } = require("./utils/env");

const log = logger("11ty:transforms", true);
const ROOT_DIR = path.dirname(require.resolve("../package.json"));

/**
 * @param asset {import("../lib").Asset}
 * @returns {string}
 */
function rebase(asset) {
  return asset.url;
}

const criticalConfig = {
  inline: { polyfill: false, preload: false },
  base: path.join(ROOT_DIR, eleventy.dir.output),
  dimensions,
  rebase,
  ignore: {
    // rule: [/\.?container/],
  },
};

/**
 * @param path {string | undefined}
 * @returns {boolean}
 */
function shouldTransform(path) {
  if (!env.production || !path) {
    return false;
  }
  return multimatch([path], globs).length !== 0;
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
      const cfg = { ...criticalConfig, html: content };
      const start = process.hrtime.bigint();
      const { html, css, uncritical } = await critical.generate(cfg);
      const ns = process.hrtime.bigint() - start;
      const elapsed = Number(ns) / 1e9;
      const fmt =
        "Extracted critical css from %s in %ss (%s critical, %s uncritical)";
      const args = [
        outputPath,
        elapsed.toFixed(3),
        formatSize(css.length),
        formatSize(uncritical.length),
      ];
      log(fmt, ...args);
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

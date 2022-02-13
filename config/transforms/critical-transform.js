const { dirname, join } = require("path");

const critical = require("critical");
const multimatch = require("multimatch");

const {
  logger,
  helpers: { humanBytes },
  env: { env },
} = require("../../build/lib");
const {
  config: {
    critical: { globs, dimensions },
    eleventy,
  },
} = require("../../package.json");

const log = logger("11ty:transforms", true);
const ROOT_DIR = dirname(require.resolve("../../package.json"));

/**
 * @param {import("../../lib").Asset} asset
 * @returns {string}
 */
function rebase(asset) {
  return asset.url;
}

const criticalConfig = {
  inline: { polyfill: false, preload: false },
  base: join(ROOT_DIR, eleventy.dir.output),
  dimensions,
  rebase,
  ignore: {
    // rule: [/\.?container/],
  },
};

/**
 * @param {string | undefined} path The path to test
 * @returns {boolean}
 */
function shouldTransform(path) {
  if (!env.production || !path) {
    return false;
  }
  return multimatch([path], globs).length !== 0;
}

/**
 * @param {string} content
 * @param {string | undefined} outputPath
 * @returns {Promise<string>} The transformed HTML (if it matches `config.globs`)
 */
async function transformCritical(content, outputPath) {
  if (shouldTransform(outputPath)) {
    log("Extracting critical css from %s", outputPath);
    try {
      const cfg = { ...criticalConfig, html: content };
      const start = process.hrtime.bigint();
      const { html, css, uncritical } = await critical.generate(cfg);
      const elapsed = Number(process.hrtime.bigint() - start) / 1e9;
      log(
        "Extracted critical css from %s in %ss (%s critical, %s uncritical)",
        outputPath,
        elapsed.toFixed(2),
        humanBytes(css.length),
        humanBytes(uncritical.length)
      );
      return html;
    } catch (e) {
      log("Critical CSS extraction failed.");
      console.error(e);
    }
  }
  return content;
}

module.exports = {
  critical: transformCritical,
};

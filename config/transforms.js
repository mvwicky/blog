const critical = require("critical");

const { logger } = require("../build/lib");
const { env } = require("./utils/env");

const log = logger("11ty:transforms", true);

const PATHS_TO_TX = ["dist/index.html"];

/**
 * @param path {string | undefined}
 * @returns {boolean}
 */
function shouldTransform(path) {
  return (
    env.NODE_ENV === "production" && path && PATHS_TO_TX.some((p) => p === path)
  );
}

/**
 * @param content {string}
 * @param outputPath {string | undefined}
 */
async function transformCritical(content, outputPath) {
  if (shouldTransform(outputPath)) {
    log("Extracting critical css from %s", outputPath);
    try {
      const config = {
        base: "dist/",
        html: content,
        inline: true,
        width: 1280,
        height: 800,
      };
      const { html } = await critical.generate(config);
      log("Extracted critical css from %s", outputPath);
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

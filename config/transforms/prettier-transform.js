const multimatch = require("multimatch");
const prettier = require("prettier");

const { logger } = require("../../build/lib");
const { formatSize } = require("../../build/lib/helpers");
const {
  config: {
    critical: { globs },
  },
} = require("../../package.json");
const { env } = require("../utils/env");

const log = logger("11ty:transforms", true);

/**
 * @param {string | undefined} path The path to test
 * @returns {boolean}
 */
function shouldTransform(path) {
  if (!env.ENABLE_PRETTIER_TRANSFORM || !path) {
    return false;
  }
  return /\.html$/.test(path) && multimatch([path], globs).length !== 0;
}

/**
 * @param {string} content
 * @param {string | undefined} outputPath
 * @returns {Promise<string>} The transformed HTML
 */
async function prettierTransform(content, outputPath) {
  if (!shouldTransform(outputPath)) {
    return content;
  }
  log("Doing prettier transform for %s", outputPath);
  const config = await prettier.resolveConfig(outputPath);
  if (!config) {
    return content;
  }
  const prettified = prettier.format(content, {
    ...config,
    parser: "html",
    embeddedLanguageFormatting: "off",
    printWidth: 120,
  });
  log(
    "Ran prettier on %s (original size: %s, prettier size: %s)",
    outputPath,
    formatSize(content.length),
    formatSize(prettified.length)
  );
  return prettified;
}

module.exports = { prettier: prettierTransform };

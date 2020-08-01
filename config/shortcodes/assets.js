const fs = require("fs");
const path = require("path");

/**
 * @typedef {{root: string, output: string}} Dirs - Directories
 */

/** @param {string} manifestPath */
function makeManifest(manifestPath) {
  return () => {
    const manifestCts = fs.readFileSync(manifestPath, { encoding: "utf-8" });
    return JSON.parse(manifestCts);
  };
}

/**
 * @param {Dirs} dirs
 */
function configure(dirs) {
  const { root, output } = dirs;
  const manifestPath = path.resolve(root, output, "assets", "manifest.json");
  const manifest = makeManifest(manifestPath);

  /**
   * Link to a build asset.
   *
   * @param {string} name
   * @returns {string}
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
    const assetPath = path.join(output, asset);
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

  return { manifest, webpackAsset, inlineWebpackAsset };
}

module.exports = { configure };

/**
 * @file Generate web app manifest.
 */

class Manifest {
  data() {
    return {
      permalink: "/manifest.webmanifest",
    };
  }

  /**
   * @param {string} rootPath
   * @param {number} size
   * @returns {{src: string, type: string, sizes: string}}
   */
  makeIcon(rootPath, size) {
    return {
      src: `${rootPath}/touch/icon-${size}.png`,
      type: "image/png",
      sizes: `${size}x${size}`,
    };
  }

  /** @param {import("../../lib").RenderArgument}  */
  render({ meta: { short_name, description, icons, ...meta } }) {
    const SPACE = "  ";
    const manifest = {
      name: meta.title,
      short_name,
      description,
      display: "standalone",
      start_url: ".",
      icons: icons.sizes.map((sz) => this.makeIcon(icons.root, sz)),
      background_color: meta.colors.background,
      theme_color: meta.colors.theme,
    };
    return JSON.stringify(manifest, undefined, SPACE);
  }
}

module.exports = Manifest;

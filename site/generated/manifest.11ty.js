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
   * @param {number} size
   * @returns {{src: string, type: string, sizes: string}}
   */
  makeIcon(size) {
    return {
      src: `/blog/assets/img/icons/touch/icon-${size}.png`,
      type: "image/png",
      sizes: `${size}x${size}`,
    };
  }

  /** @param {{meta: import("../../lib").Meta}}  */
  render({ meta: { short_name, description, ...meta } }) {
    const SPACE = "  ";
    const icons = meta.icon_sizes.map((sz) => this.makeIcon(sz));
    const manifest = {
      name: meta.title,
      short_name,
      description,
      display: "standalone",
      start_url: ".",
      icons,
      background_color: meta.colors.background,
      theme_color: meta.colors.background,
    };
    return JSON.stringify(manifest, undefined, SPACE);
  }
}

module.exports = Manifest;

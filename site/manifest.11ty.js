/**
 * @file Generate web app manifest.
 */

/**
 * @typedef {object} Meta - The data from `site/_data/meta.yaml`
 * @property {number[]} icon_sizes
 * @property {string} title
 * @property {string} short_name
 * @property {string} description
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
      src: `/img/icons/touch/icon-${size}.png`,
      type: "image/png",
      sizes: `${size}x${size}`,
    };
  }

  /** @param {{meta: Meta}}  */
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
      background_color: "",
      theme_color: "",
    };
    return JSON.stringify(manifest, undefined, SPACE);
  }
}

module.exports = Manifest;

module.exports = class {
  data() {
    return {
      permalink: "/manifest.webmanifest",
      eleventyExcludeFromCollections: true,
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

  render({ meta }) {
    const SPACE = "  ";
    const manifest = {
      name: meta.title,
      short_name: meta.short_name,
      description: meta.description,
      display: "standalone",
      start_url: ".",
      icons: [
        this.makeIcon(96),
        this.makeIcon(128),
        this.makeIcon(192),
        this.makeIcon(512),
      ],
      background_color: "",
      theme_color: "",
    };
    return JSON.stringify(manifest, undefined, SPACE);
  }
};

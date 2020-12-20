class Robots {
  data() {
    return {
      permalink: "/robots.txt",
    };
  }
  /** @param {{meta: import("../../lib").Meta}}  */
  render({ meta }) {
    const lines = [
      "User-agent: *",
      "Disallow: /drafts/",
      `Sitemap: ${meta.url}/sitemap.xml`,
    ];
    return lines.join("\n");
  }
}

module.exports = Robots;

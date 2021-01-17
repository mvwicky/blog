class Robots {
  data() {
    return {
      permalink: "/robots.txt",
    };
  }
  render({ pkg }) {
    const lines = [
      "User-agent: *",
      "Disallow: /drafts/",
      `Sitemap: ${pkg.homepage}/sitemap.xml`,
    ];
    return lines.join("\n");
  }
}

module.exports = Robots;

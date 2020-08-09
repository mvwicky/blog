class Robots {
  data() {
    return {
      permalink: "/robots.txt",
    };
  }
  render(data) {
    return ["User-agent: *", "Disallow: /drafts/"].join("\n");
  }
}

module.exports = Robots;

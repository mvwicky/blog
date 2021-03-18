const SITE_FIXED = [
  "Language:English",
  "Doctype:HTML5",
  "IDE:Sublime Text, VSCode",
];

module.exports = class Humans {
  data() {
    return {
      permalink: "/humans.txt",
      date: "Last Modified",
    };
  }

  /** @param {[string, string[]]} section */
  makeSection(section) {
    const [title, rawLines] = section;
    const lines = rawLines
      .map((line) => (line.length > 0 ? `\t${line}` : ""))
      .join("\n");
    return `/* ${title} */
${lines}`;
  }

  /** @param {import("../../lib").RenderArgument}  */
  render({ meta, page }) {
    const date = page.date.toISOString().split("T")[0];
    /** @type {[string, string[]][]} */
    const parts = [
      ["TEAM", [`Lead:${meta.author}`, `From:${meta.author_from}`]],
      ["SITE", [`Last update:${date}`, ...SITE_FIXED]],
    ];
    return parts.map(this.makeSection.bind(this)).join("\n\n");
  }
};

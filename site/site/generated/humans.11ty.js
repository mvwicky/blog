class Humans {
  data() {
    return {
      permalink: "/humans.txt",
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

  render({ meta }) {
    /** @type {[string, string[]][]} */
    const parts = [
      ["TEAM", [`Lead:${meta.author}`, "From:Santa Barbara,California"]],
      ["SITE", ["Language:English", "Doctype:HTML5"]],
    ];
    return parts.map(this.makeSection.bind(this)).join("\n\n");
  }
}

module.exports = Humans;

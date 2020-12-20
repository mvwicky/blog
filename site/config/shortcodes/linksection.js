/**
 * @param {string} content
 * @param {import("../../build/lib/types").Link} linkObj
 */
function linksection(content, linkObj) {
  const title = linkObj
    ? `#### [${linkObj.title}](${linkObj.href}) {.link-title}`
    : "";
  const author = linkObj ? `##### ${linkObj.author} {.link-author}` : "";
  return `<section class="section link-section">

${title}

${author}

${content}
  </section>`;
}

module.exports = { linksection };

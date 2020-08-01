/**
 * @param {string} content
 * @param {import("../../lib/types").Link} linkObj
 */
function linksection(content, linkObj) {
  const title = linkObj
    ? `#### [${linkObj.title}](${linkObj.href}) {.link-title}`
    : "";
  const author = linkObj ? `##### ${linkObj.author} {.link-author}` : "";
  return `<section class="section border-t pt-3">
<!-- <hr class="mt-8 mb-2"> -->

${title}

${author}

${content}
  </section>`;
}

module.exports = { linksection };

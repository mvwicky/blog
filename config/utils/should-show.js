const { env } = require("./env");

/** @param {import("../../lib/types").CollectionItem} page */
function shouldShow(page) {
  const { published, tags } = page.data;
  const pub = env.unpublished || published;
  const draft = env.drafts || !(tags || []).includes("draft");
  return pub && draft;
}

module.exports = { shouldShow };

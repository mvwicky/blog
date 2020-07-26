const { env } = require("../env");

function shouldShow(page) {
  const { published, tags } = page.data;
  const pub = env.unpublished || published;
  const draft = env.drafts || !tags.includes("draft");
  return pub && draft;
}

module.exports = function (collectionApi) {
  return collectionApi.getFilteredByTag("post").filter(shouldShow);
};

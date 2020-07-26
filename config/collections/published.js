const { shouldShow } = require("../utils/should-show");

/** @param {import("../types").CollectionApi} collectionApi */
function getPublished(collectionApi) {
  return collectionApi.getFilteredByTag("post").filter(shouldShow);
}

module.exports = getPublished;

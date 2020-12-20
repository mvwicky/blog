const { shouldShow } = require("../utils/should-show");

/** @param {import("../../build/lib").CollectionApi} collectionApi */
function getPublished(collectionApi) {
  return collectionApi.getFilteredByTag("post").filter(shouldShow);
}

module.exports = getPublished;

/**
 * @param {string} tag
 * @returns {boolean}
 */
function keepTag(tag) {
  switch (tag) {
    case "all":
    case "page":
    case "tagList":
    case "draft":
      return false;
    default:
      return true;
  }
}

/** @param {import("../types").CollectionApi} collectionApi */
function getTagList(collectionApi) {
  const tagsSet = new Set();
  collectionApi
    .getAll()
    .map((item) => item.data.tags || [])
    .flat()
    .filter(keepTag)
    .forEach((tag) => tagsSet.add(tag));

  return [...tagsSet];
}

module.exports = getTagList;

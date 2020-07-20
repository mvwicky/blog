module.exports = function (collectionApi) {
  return collectionApi.getFilteredByTag("post").filter((page) => {
    const { published, tags } = page.data;
    return published && !tags.includes("draft");
  });
};

module.exports = function (collectionApi) {
  let tagsSet = new Set();
  collectionApi
    .getAll()
    .filter((item) => "tags" in item.data)
    .forEach((item) => {
      item.data.tags
        .filter((tag) => {
          switch (tag) {
            case "all":
            case "page":
              return false;
            default:
              return true;
          }
        })
        .forEach((tag) => tagsSet.add(tag));
    });
  return [...tagsSet];
};

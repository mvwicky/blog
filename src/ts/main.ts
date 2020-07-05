import { elemIsTag } from "./elem-is-tag";
import { initFootnotes } from "./footnotes";
import { initPostlist } from "./postslist";

(function () {
  console.log("Loaded");
  initFootnotes();
  const tagSelect = document.getElementById("post-tags");
  const postsList = document.getElementById("posts-list");
  if (postsList !== null && elemIsTag(tagSelect, "select")) {
    if (tagSelect.offsetParent !== null) {
      initPostlist(postsList, tagSelect);
    }
  }
})();

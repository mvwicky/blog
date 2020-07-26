import { elemIsTag } from "./elem-is-tag";
import { initFootnotes } from "./footnotes";
import { initPostlist } from "./postslist";

(function () {
  console.log("Loaded");
  const tagSelect = document.getElementById("post-tags");
  const postsList = document.getElementById("posts-list");
  if (postsList !== null && elemIsTag(tagSelect, "select")) {
    console.log(tagSelect.offsetParent);
    if (tagSelect.offsetParent !== null) {
      initPostlist(postsList, tagSelect);
    }
  }
  if (document.getElementsByClassName("footnote-ref").length > 0) {
    initFootnotes();
  }
})();

import { elemIsTag } from "./helpers/elem-is-tag";
import { initPostlist } from "./postslist";

(async function () {
  console.log("Loaded");
  const tagSelect = document.getElementById("post-tags");
  const postsList = document.getElementById("posts-list");
  if (postsList && elemIsTag(tagSelect, "select")) {
    console.log(tagSelect.offsetParent);
    if (tagSelect.offsetParent) {
      initPostlist(postsList, tagSelect);
    }
  }
  if (document.getElementsByClassName("footnote-ref").length) {
    const { initFootnotes } = await import("./footnotes");
    initFootnotes();
  }
  if (!PRODUCTION) {
    const { initDev } = await import("./dev");
    initDev();
  }
})();

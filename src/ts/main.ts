import { elemIsTag } from "./helpers/elem-is-tag";
import { initPostlist } from "./postslist";

(async function () {
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
    const { initFootnotes } = await import(
      /* webpackChunkName: "footnotes" */ "./footnotes"
    );
    initFootnotes();
  }
  if (!PRODUCTION) {
    const { initDev } = await import("./dev");
    initDev();
  }
})();

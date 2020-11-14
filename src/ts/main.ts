import { elemIsTag } from "./elem-is-tag";
import { prod } from "./helpers/const";
import { debounce } from "./helpers/debounce";
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
  if (!prod && "onresize" in window) {
    const sizeContainer = document.createElement("div");
    sizeContainer.classList.add("size-container", "print:hidden");
    sizeContainer.style.position = "fixed";
    sizeContainer.style.bottom = "0.5rem";
    sizeContainer.style.left = "0.5rem";
    addResizeListener(sizeContainer);
  }
})();

function getBreakpointName(width: number): string {
  if (width < 576) {
    return "SM";
  } else if (width < 768) {
    return "MD";
  } else if (width < 992) {
    return "LG";
  } else {
    return "XL";
  }
}

function showSize(el: HTMLElement) {
  const [width, height] = [window.innerWidth, window.innerHeight];
  const bp = getBreakpointName(width);
  el.innerHTML = `<code>${width}&times;${height} (${bp})</code>`;
}

function addResizeListener(container: HTMLElement) {
  const resizeHandler = debounce(showSize.bind(null, container));
  window.addEventListener("resize", resizeHandler);
  showSize(container);
  document.body.append(container);
}

import { elemIsTag } from "./elem-is-tag";
import { prod } from "./helpers/const";
import { initPostlist } from "./postslist";

declare const BREAKPOINT_2XL: number;
declare const BREAKPOINT_XL: number;
declare const BREAKPOINT_LG: number;
declare const BREAKPOINT_MD: number;
declare const BREAKPOINT_SM: number;

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
  if (width < BREAKPOINT_MD) {
    return "SM";
  } else if (width < BREAKPOINT_LG) {
    return "MD";
  } else if (width < BREAKPOINT_XL) {
    return "LG";
  } else if (width < BREAKPOINT_2XL) {
    return "XL";
  } else {
    return "2XL";
  }
}

function showSize(el: HTMLElement) {
  const [width, height] = [window.innerWidth, window.innerHeight];
  const bp = getBreakpointName(width);
  el.innerHTML = `<code>${width}&times;${height} (${bp})</code>`;
}

function addResizeListener(container: HTMLElement) {
  const resizeHandler = showSize.bind(null, container);
  window.addEventListener("resize", resizeHandler);
  showSize(container);
  document.body.append(container);
}

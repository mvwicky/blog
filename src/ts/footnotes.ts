/**
 * @file Footnotes
 *
 * Footnotes:
 * <sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup>
 *
 * <li class="footnote-item" id="fn1">
 *   <p>Some Text<a href="#fnref1" class="footnote-backref">`back`</a>
 *   </p>
 * </li>
 */

import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
// import "tippy.js/themes/light.css";
// import "tippy.js/themes/light-border.css";
// import "tippy.js/themes/material.css";
// import "tippy.js/themes/translucent.css";

import { elemIsTag } from "./elem-is-tag";

const FN_ITEM_CLASS = "footnote-item";

function truthy<T>(obj: T | undefined | null): obj is T {
  return obj !== undefined && obj !== null;
}

function compact<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter(truthy);
}

function getFnContent(item: HTMLElement): string {
  const content = item.innerHTML.trim();
  const backref = item.querySelector(".footnote-backref");
  if (backref !== null) {
    console.log(backref.outerHTML);
    return content.replace(backref.outerHTML, "");
  } else {
    return content;
  }
}

function fromFnItem(item: HTMLElement) {
  const itemId = item.id;
  console.log(`itemId=${itemId}`);
  const ref = document.querySelector(`[href="#${itemId}"]`);
  if (elemIsTag(ref, "a")) {
    const content = getFnContent(item);
    console.log(content);
    tippy(ref, {
      content,
      allowHTML: true,
      onShow: (inst) => {
        console.log(inst);
      },
      // theme: "light-border",
      duration: [600, 500],
      inertia: true,
      placement: "auto-end",
      // trigger: "click"
    });
  }
}

function getFootnotes() {
  Array.from(document.getElementsByClassName(FN_ITEM_CLASS), (e) =>
    fromFnItem(e as HTMLElement)
  );
  // const supRefs = Array.from(
  //   document.getElementsByClassName("footnote-ref"),
  //   (e) => e as HTMLElement
  // );
  // supRefs.map((e) => e.firstElementChild).filter((e) => elemIsTag(e, "a"));
  // const refLinks = compact<Element>(supRefs.map((e) => e.firstElementChild));
}

export function initFootnotes() {
  getFootnotes();
}

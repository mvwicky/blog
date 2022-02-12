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
import type { Tippy } from "tippy.js";

import { elemIsTag } from "./helpers/elem-is-tag";

const FN_ITEM_CLASS = ".footnote-item";

function truthy<T>(obj: T | undefined | null): obj is T {
  return obj !== undefined && obj !== null;
}

function compact<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter(truthy);
}

function getFnContent(item: HTMLElement): string {
  const content = item.innerHTML.trim();
  const backref = item.querySelector(".footnote-backref");
  if (backref) {
    console.log(backref.outerHTML);
    return content.replace(backref.outerHTML, "");
  } else {
    return content;
  }
}

function fromFnItem(tippy: Tippy, item: HTMLElement) {
  const { id } = item;
  console.log(`itemId=${id}`);
  const ref = document.querySelector(`[href="#${id}"]`);
  if (elemIsTag(ref, "a")) {
    const content = getFnContent(item);
    console.log(content);
    tippy(ref, {
      content,
      allowHTML: true,
      onShow: (inst) => {
        console.log(inst);
      },
      theme: "light-border",
      duration: [600, 500],
      inertia: true,
      placement: "auto-end",
      // trigger: "click"
    });
  }
}

async function getFootnotes(tippy: Tippy) {
  Array.from(document.getElementsByClassName(FN_ITEM_CLASS), (e) =>
    fromFnItem(tippy, e as HTMLElement)
  );
  // const supRefs = Array.from(
  //   document.getElementsByClassName("footnote-ref"),
  //   (e) => e as HTMLElement
  // );
  // supRefs.map((e) => e.firstElementChild).filter((e) => elemIsTag(e, "a"));
  // const refLinks = compact<Element>(supRefs.map((e) => e.firstElementChild));
}

export async function initFootnotes() {
  const [{ default: tippy }] = await Promise.all([
    import("tippy.js"),
    import(/* webpackMode: "eager" */ "tippy.js/dist/tippy.css"),
    import(/* webpackMode: "eager" */ "tippy.js/themes/light.css"),
    import(/* webpackMode: "eager" */ "tippy.js/themes/light-border.css"),
    import(/* webpackMode: "eager" */ "tippy.js/themes/material.css"),
    import(/* webpackMode: "eager" */ "tippy.js/themes/translucent.css"),
  ]);
  getFootnotes(tippy);
}

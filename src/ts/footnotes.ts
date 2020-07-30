/**
 * @file Footnotes
 */

import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

const SUP_CLASS = "footnote-ref";
const LINK_SEL = `${SUP_CLASS} > a`;

const FN_TEXT_CLASS = "footnote-item";

interface Footnote {
  ref: HTMLElement;
  backref: HTMLElement;
}

function truthy<T>(obj: T | undefined | null): obj is T {
  return obj !== undefined && obj !== null;
}

function compact<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter(truthy);
}

function activateFootnote(fnref: HTMLElement, fnContent: HTMLElement) {
  tippy(fnref, { content: fnContent.innerHTML });
}

function getFootnotes() {
  const supRefs = Array.from(
    document.getElementsByClassName("footnote-ref"),
    (e) => e as HTMLElement
  );
  const refLinks = compact<Element>(supRefs.map((e) => e.firstElementChild));
}

export function initFootnotes() {}

declare const BREAKPOINT_2XL: number;
declare const BREAKPOINT_XL: number;
declare const BREAKPOINT_LG: number;
declare const BREAKPOINT_MD: number;
declare const BREAKPOINT_SM: number;

export function initDev() {
  if ("onresize" in window) {
    const sizeContainer = document.createElement("div");
    sizeContainer.classList.add("size-container", "print:hidden");
    const { style } = sizeContainer;
    const dist = "0.33rem";
    style.position = "fixed";
    style.bottom = dist;
    style.left = dist;
    style.border = "1px solid black";
    style.borderRadius = "0.25rem";
    style.backgroundColor = "#e5e7ebe0";
    style.padding = "0.2rem";

    addResizeListener(sizeContainer);
  }
}

function addResizeListener(container: HTMLElement) {
  const resizeHandler = showSize.bind(null, container);
  window.addEventListener("resize", resizeHandler);
  showSize(container);
  document.body.append(container);
}

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

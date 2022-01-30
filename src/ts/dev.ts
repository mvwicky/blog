declare const BREAKPOINT_2XL: number;
declare const BREAKPOINT_XL: number;
declare const BREAKPOINT_LG: number;
declare const BREAKPOINT_MD: number;
declare const BREAKPOINT_SM: number;

const BP_LIST = [
  ["SM", BREAKPOINT_MD],
  ["MD", BREAKPOINT_LG],
  ["LG", BREAKPOINT_XL],
  ["XL", BREAKPOINT_2XL],
] as const;

export function initDev() {
  if ("onresize" in window) {
    const sizeContainer = document.createElement("div");
    sizeContainer.classList.add("size-container", "print:hidden");
    const dist = "0.33rem";
    Object.assign<CSSStyleDeclaration, Partial<CSSStyleDeclaration>>(
      sizeContainer.style,
      {
        position: "fixed",
        bottom: dist,
        left: dist,
        border: "1px solid black",
        borderRadius: "0.25rem",
        backgroundColor: "#e5e7ebe0",
        padding: "0.2rem",
      }
    );
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
  for (const [bpName, bp] of BP_LIST) {
    if (width < bp) {
      return bpName;
    }
  }
  return "2XL";
}

function showSize(el: HTMLElement) {
  const [width, height] = [window.innerWidth, window.innerHeight];
  const bp = getBreakpointName(width);
  window.requestAnimationFrame(() => {
    el.innerHTML = `<code>${width}px &times; ${height}px (${bp})</code>`;
  });
}

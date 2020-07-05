type Tags = HTMLElementTagNameMap;

function elemIsTag<K extends keyof Tags>(
  elem: Node | null | undefined,
  tag: K
): elem is Tags[K] {
  return (
    elem !== null &&
    elem !== undefined &&
    elem.nodeType === Node.ELEMENT_NODE &&
    elem.nodeName === tag.toLocaleUpperCase()
  );
}

export { elemIsTag };

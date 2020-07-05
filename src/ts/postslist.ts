export function initPostlist(
  postsList: HTMLElement,
  tagSelect: HTMLSelectElement
) {
  console.log("Posts List");
  const tagElems = postsList.getElementsByClassName("posts-list-title");
  const tags = new Set<string>();
  Array.from(tagElems, (elem) => {
    const el = elem as HTMLElement;
    const tagNames = (el.dataset.tags ?? "").split(" ");
    if (tagNames.length > 0) {
      tagNames.forEach((t) => tags.add(t));
    }
  });
  console.log(Array.from(tags));
  Array.from(tags, (tagName) => {
    const opt = document.createElement("option");
    opt.label = tagName;
    opt.textContent = tagName;
    opt.value = String(tagSelect.options.length);

    tagSelect.appendChild(opt);
  });
}

(function (g: Window, doc: Document) {
  console.log("Loaded");
  const div = doc.createElement("div");
  div.classList.add("w-6/12", "bg-red-500", "h-24");
  // doc.body.appendChild(div);
})(window, document);

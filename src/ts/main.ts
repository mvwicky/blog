import { initFootnotes } from "./footnotes";

(function () {
  console.log("Loaded");
  registerServiceWorker();
  initFootnotes();
})();

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log(`Registered service worker with scope "${reg.scope}".`);
      })
      .catch((error) => {
        console.log(`Registration failed with error ${error}`);
      });
  }
}

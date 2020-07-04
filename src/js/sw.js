/// <reference lib="webworker" />

const styles = [
  "background-color: #6495ED",
  "color: #ffffff",
  "font-weight: bold",
  "border-radius: 0.33em",
  "padding: 2px 0.2em",
].map((rule) => `${rule};`);
const log = console.log.bind(console, "%c[sw]", styles.join(" "));

const cacheName = "wherewasicaching";
const preCache = ["./reading/", "./reading/index.html"];

/** @param {InstallEvent} event */
function handleInstall(event) {
  log("Installed");
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== cacheName) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => caches.open(cacheName))
      .then((cache) => cache.addAll(preCache))
  );
}

/** @param {FetchEvent} event */
function handleFetch(event) {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
}

self.addEventListener("install", handleInstall);
self.addEventListener("fetch", handleFetch);

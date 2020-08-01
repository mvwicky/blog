import * as path from "path";

import workboxBuild from "workbox-build";

import { logger } from "../lib";

const log = logger("build:sw", true);

const root = path.dirname(__dirname);

async function build() {
  const swDest = path.resolve(root, "dist", "sw.js");
  const globDirectory = path.resolve(root, "dist");
  log("%o", { swDest, globDirectory });
  const globPatterns = ["**/*.{js,css,html,ico,woff,woff2}"];
  const [maxEntries, maxAgeSeconds] = [30, 14 * 86400];
  const runtimeOpts = {
    cacheableResponse: { statuses: [200] },
    expiration: { maxEntries, maxAgeSeconds },
  };
  const runtimeCaching = [
    {
      urlPattern: /\/blog\//,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "blog-posts", ...runtimeOpts },
    },
    {
      urlPattern: /\/pages\//,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "blog-pages", ...runtimeOpts },
    },
  ];
  try {
    const { count, filePaths, size, warnings } = await workboxBuild.generateSW({
      mode: "development",
      swDest,
      globDirectory,
      globPatterns,
      globStrict: true,
      directoryIndex: "index.html",
      cacheId: "wherewasicaching",
      cleanupOutdatedCaches: true,
      maximumFileSizeToCacheInBytes: 4e6,
      // runtimeCaching,
    });
    log("%d warning%s", warnings.length, warnings.length === 1 ? "" : "s");
    warnings.forEach((warning) => console.warn(warning));
    if (count === 0 || size === 0) {
      throw new Error("Failed to precache anything");
    }
    log("%d File%s Precached", count, count === 1 ? "" : "s");
    log("Total Bytes Precached: %d", size);
    log("Files Written: %O", filePaths);
  } catch (e) {
    console.error(e);
  }
}

(async function () {
  await build();
})();

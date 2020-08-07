import * as path from "path";

import workboxBuild from "workbox-build";

import { humanBytes, logger } from "../lib";

const log = logger("build:sw", true);

const root = path.dirname(__dirname);

async function build() {
  const swDest = path.resolve(root, "dist", "sw.js");
  const globDirectory = path.resolve(root, "dist");
  log("%o", { swDest, globDirectory });
  const globPatterns = ["**/*.{js,css,html,ico,woff,woff2}"];
  try {
    const start = process.uptime();
    const { count, filePaths, size, warnings } = await workboxBuild.generateSW({
      mode: "production",
      swDest,
      globDirectory,
      globPatterns,
      globStrict: true,
      directoryIndex: "index.html",
      cacheId: "wherewasicaching",
      cleanupOutdatedCaches: true,
      maximumFileSizeToCacheInBytes: 4e6,
    });
    const elapsed = process.uptime() - start;
    const elapsedStr = elapsed.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
    log("Elapsed: %s seconds", elapsedStr);
    log("%d warning%s", warnings.length, warnings.length === 1 ? "" : "s");
    warnings.forEach((warning) => console.warn(warning));
    if (count === 0 || size === 0) {
      throw new Error("Failed to precache anything");
    }
    log("%d file%s precached", count, count === 1 ? "" : "s");
    log("Total size of precached files: %s", humanBytes(size), size);
    log("Files written: %O", filePaths);
  } catch (e) {
    console.error(e);
  }
}

(async function () {
  await build();
})();

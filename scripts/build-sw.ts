import * as path from "path";

import workboxBuild from "workbox-build";

import { env, humanBytes, logger } from "../lib";
import * as pkg from "../package.json";
import { getRoot } from "./build-utils";

const log = logger("sw", true);

log("NODE_ENV=%s", env.NODE_ENV);

const EXTS_TO_GLOB: string[] = [
  "js",
  "css",
  "html",
  "ico",
  "woff",
  "woff2",
  "txt",
  "webmanifest",
  "png",
];

async function build(rootDir: string) {
  const relToRoot = (p: string) => path.relative(rootDir, p);
  const { dir: dirs } = pkg.config.eleventy;
  const outputDir = path.resolve(rootDir, dirs.output);
  const swDest = path.join(outputDir, "sw.js");
  const globDirectory = outputDir;
  log("Output File: %s", relToRoot(swDest));
  const globPatterns = EXTS_TO_GLOB.map((ext) => `**/*.${ext}`);
  log("Glob Patterns: %o", globPatterns);
  try {
    const start = process.uptime();
    const { count, filePaths, size, warnings } = await workboxBuild.generateSW({
      mode: env.NODE_ENV,
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
    log("Total size of precached files: %s", humanBytes(size));
    const nWritten = filePaths.length;
    log("%d file%s written", nWritten, nWritten == 1 ? "" : "s");
  } catch (e) {
    console.error(e);
  }
}

(async function () {
  const start = process.uptime();
  const root = await getRoot();
  await build(root);
  const elapsed = process.uptime() - start;
  const elapsedStr = elapsed.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  log("Elapsed: %s seconds", elapsedStr);
})();

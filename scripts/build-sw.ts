import * as path from "path";

import { generateSW } from "workbox-build";

import { env, humanBytes, logger } from "../lib";
import * as pkg from "../package.json";
import { getRoot, timeCall } from "./build-utils";

const log = logger("sw", true);

log("NODE_ENV=%s", env.NODE_ENV);

const EXTS_TO_GLOB: readonly string[] = [
  "css",
  "html",
  "ico",
  "js",
  "map",
  "png",
  "svg",
  "txt",
  "webmanifest",
  "woff",
  "woff2",
] as const;

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
    const { count, filePaths, size, warnings } = await generateSW({
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
    log("%d warning%s", warnings.length, warnings.length === 1 ? "" : "s");
    warnings.forEach((warning) => console.warn(warning));
    if (count === 0 || size === 0) {
      throw new Error("Failed to precache anything");
    }
    log("%d file%s precached", count, count === 1 ? "" : "s");
    log(
      "Total size of precached file%s: %s",
      count === 1 ? "" : "s",
      humanBytes(size)
    );
    const nWritten = filePaths.length;
    log("%d file%s written", nWritten, nWritten == 1 ? "" : "s");
    for (const filePath of filePaths) {
      log("    - %s", relToRoot(filePath));
    }
  } catch (e) {
    console.error(e);
  }
}

(async function () {
  await timeCall(log, async () => {
    const root = await getRoot();
    await build(root);
  });
})();

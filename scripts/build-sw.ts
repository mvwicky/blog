import { promises as fs } from "node:fs";
import { join, relative, resolve } from "node:path";

import { generateSW } from "workbox-build";

import { env, humanBytes, logger } from "../lib";
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

async function getPackageData(rootDir: string) {
  const pkgPath = resolve(rootDir, "package.json");
  const contents = await fs.readFile(pkgPath, { encoding: "utf-8" });
  return JSON.parse(contents);
}

async function getFileSize(p: string): Promise<number> {
  const { size } = await fs.stat(p);
  return size;
}

function withMap(base: string): string[] {
  return [base, `${base}.map`];
}

async function build(rootDir: string) {
  const pkg = await getPackageData(rootDir);
  const relToRoot = (p: string) => relative(rootDir, p);
  const { dir: dirs } = pkg.config.eleventy;
  const outputDir = resolve(rootDir, dirs.output);
  log("Root Directory: %s", rootDir);
  log("Output Directory: %s", relToRoot(outputDir));
  const swName = "sw.js";
  const swDest = join(outputDir, swName);
  const globDirectory = outputDir;
  log("Output File: %s", relToRoot(swDest));
  const globPatterns = EXTS_TO_GLOB.map((ext) => `**/*.${ext}`);
  log("Glob Patterns: %o", globPatterns);
  const globIgnores = withMap(swName).concat(withMap("workbox-*.js"));
  log("Glob Ignores:  %o", globIgnores);
  try {
    const { count, filePaths, size, warnings } = await generateSW({
      mode: env.NODE_ENV,
      swDest,
      globDirectory,
      globPatterns,
      globIgnores,
      globStrict: true,
      directoryIndex: "index.html",
      cacheId: "wherewasicaching",
      cleanupOutdatedCaches: true,
      maximumFileSizeToCacheInBytes: 4e6,
    });
    const { length: nWarnings } = warnings;
    log("%d warning%s", nWarnings, nWarnings === 1 ? "" : "s");
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
    const { length: nWritten } = filePaths;
    log("%d file%s written", nWritten, nWritten == 1 ? "" : "s");
    const _fsize: (p: string) => Promise<[string, number]> = async (p) => {
      return [p, await getFileSize(p)] as [string, number];
    };
    const fileSizes = await Promise.all(filePaths.map(_fsize));
    for (const [filePath, fileSize] of fileSizes) {
      log("    - %s (%s)", relToRoot(filePath), humanBytes(fileSize));
    }
  } catch (e) {
    console.error(e);
  }
}

(async function () {
  log("Creating service worker.");
  await timeCall(log, async () => {
    const root = await getRoot();
    await build(root);
  });
})();

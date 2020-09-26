import * as crypto from "crypto";
import { promises as fs } from "fs";
import * as path from "path";

import postcss from "postcss";
import type { Configuration, Stats } from "webpack";

import { env } from "../lib";

const ROOT = path.dirname(__dirname);

export async function getConfig(): Promise<Configuration> {
  const conf = env.PROD
    ? import("../webpack.prod")
    : import("../webpack.config");
  const { config } = await conf;
  return config;
}

export function runHandler(err: Error, stats: Stats) {
  const info = stats.toJson();
  if (err || stats.hasErrors()) {
    console.error(info.errors);
    if (err) {
      console.error(err);
      console.error(err.stack || err);
    }
  }
  showStats(stats, info);
}

export function showStats(stats: Stats, info: Stats.ToJsonOutput) {
  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }
  const statsString = stats.toString({
    all: false,
    children: false,
    modules: false,
    entrypoints: true,
    hash: true,
    version: false,
    builtAt: false,
    cachedAssets: false,
    env: true,
    assetsSort: "size",
    assets: true,
    colors: true,
    timings: true,
    excludeAssets: (asset) => !/\.(js|css)$/.test(asset),
  });
  process.stdout.write(statsString);
  process.stdout.write("\n");
}

function hashedFilename(base: string, ext: string, contents: string): string {
  const hash = crypto.createHash("md5");
  hash.update(contents);
  const digest = hash.digest("hex");
  return [base, digest, ext].join(".");
}

export async function buildCSS() {
  const styleFile = path.join(ROOT, "src", "css", "style.css");
  const [{ default: config }, styleCts] = await Promise.all([
    import("../postcss.config"),
    fs.readFile(styleFile, "utf-8"),
  ]);
  const outDir = path.join(ROOT, "dist", "assets");
  const processor = postcss(config.plugins);
  const result = await processor.process(styleCts, {
    from: styleFile,
    to: outDir,
    map: config.map,
  });
  const { css } = result;
  const outName = env.PROD ? hashedFilename("style", "css", css) : "style.css";
  const outFile = path.join(outDir, outName);
  await fs.writeFile(outFile, css);
}

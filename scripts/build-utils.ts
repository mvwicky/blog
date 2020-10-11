import * as crypto from "crypto";
import { promises as fs } from "fs";
import * as path from "path";

import * as esbuild from "esbuild";
import findUp from "find-up";
import mem from "mem";
import postcss from "postcss";
import type { Configuration, Stats } from "webpack";

import { env, logger } from "../lib";
import * as pkg from "../package.json";

const log = logger("assets", true);

export const ROOT = path.dirname(__dirname);

async function _getRoot(): Promise<string> {
  try {
    const root = await findUp("package.json");
    if (root !== undefined) {
      return path.dirname(root);
    }
  } catch (e) {
    console.error(e);
  }
  return ROOT;
}

export const getRoot = mem(_getRoot);

export async function getWebpackConfig(): Promise<Configuration> {
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

export function hashed(cts: crypto.BinaryLike, algorithm: string = "md5") {
  const hash = crypto.createHash(algorithm);
  hash.update(cts);
  return hash.digest("hex");
}

interface HashedFileOptions {
  baseName: string;
  ext: string;
  contents: crypto.BinaryLike;
  digestLength: number;
}

function hashedFilename({
  contents,
  baseName,
  ext,
  digestLength,
}: HashedFileOptions): string {
  const digest = hashed(contents).slice(digestLength);
  return [baseName, digest, ext].join(".");
}

export async function buildCSS() {
  const root = await getRoot();
  const styleFile = path.resolve(root, pkg.config.entrypoints.styles);
  const [{ default: config }, styleCts] = await Promise.all([
    import("../postcss.config"),
    fs.readFile(styleFile, "utf-8"),
  ]);
  const outDir = path.join(root, "dist", "assets");
  const processor = postcss(config.plugins);
  const result = await processor.process(styleCts, {
    from: styleFile,
    to: outDir,
    map: config.map,
  });
  const { css } = result;
  const hashedOpts: HashedFileOptions = {
    baseName: "style",
    ext: "css",
    contents: css,
    digestLength: 16,
  };
  const outName = !env.PROD ? "style.css" : hashedFilename(hashedOpts);
  const outFile = path.join(outDir, outName);
  await fs.writeFile(outFile, css);
}

export async function buildTS() {
  const main = path.resolve(ROOT, pkg.config.entrypoints.main);
  const options: esbuild.BuildOptions = {
    entryPoints: [main],
    minify: env.PROD,
    bundle: true,
    outdir: path.resolve(ROOT, "dist", "assets"),
    // splitting: true,
    // format: "esm",
    target: "es2017",
    metafile: path.resolve(ROOT, "dist", "metafile.json"),
    write: false,
  };
  const { warnings, outputFiles } = await esbuild.build(options);
  if (warnings) {
    log("%o", warnings);
  }
  if (!outputFiles) {
    return;
  }
  await Promise.all(
    outputFiles.map(({ contents, path }) => {
      if (!env.PROD) {
        return fs.writeFile(path, contents);
      } else {
        return fs.writeFile(path, contents);
      }
    })
  );
}

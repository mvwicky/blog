import * as crypto from "crypto";
import { constants, promises as fs } from "fs";
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
const digestLength = 16;

interface HashedFileOptions {
  name: string;
  contents: string | Uint8Array;
  digestLength: number;
}

interface WriteHashedFileOptions {
  ext: string;
  contents: string | Uint8Array;
  digestLength: number;
}

interface Info {
  errors: string[];
  warnings: string[];
}

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

async function isDir(p: string): Promise<boolean> {
  try {
    const stat = await fs.stat(p);
    const exists = Boolean(stat.mode & constants.S_IFDIR);
    return exists;
  } catch (e) {
    return false;
  }
}

async function createDir(p: string) {
  const exists = await isDir(p);
  if (!exists) {
    await fs.mkdir(p);
  }
}

export const getRoot = mem(_getRoot);

async function _getOutputDir(create: boolean = true) {
  const root = await getRoot();
  const dir = path.join(root, "dist");
  if (create) {
    await createDir(dir);
  }
  return dir;
}

const getOutputDir = mem(_getOutputDir);

async function _getAssetsDir(create: boolean = true) {
  const outputDir = await getOutputDir(create);
  const dir = path.join(outputDir, "assets");
  if (create) {
    await createDir(dir);
  }
  return dir;
}

export const getAssetsDir = mem(_getAssetsDir);

export async function getWebpackConfig(): Promise<Configuration> {
  const conf = env.PROD
    ? import("../webpack.prod")
    : import("../webpack.config");
  const { config } = await conf;
  return config;
}

export function webpackManifest(stats: Stats) {
  const statsJson = stats.toJson({
    all: false,
    entrypoints: true,
    outputPath: true,
    publicPath: true,
    assets: true,
  });
  log("%o", Object.keys(statsJson));
  log("assets.length=%d", statsJson.assets.length);
  log("%s", statsJson.outputPath);
  log("%O", { ...statsJson.entrypoints });
}

export function runHandler(err?: Error, stats?: Stats) {
  const info: Info | undefined = stats?.toJson();
  if (err || stats?.hasErrors()) {
    if (info?.errors) {
      console.error(info.errors);
    }
    if (err) {
      console.error(err);
      console.error(err.stack || err);
    }
    log("Dumping out.");
    return undefined;
  }
  if (stats) {
    // webpackManifest(stats);
  }
  if (stats && info) {
    showStats(stats, info);
  }
}

export async function getEntrypoint(name: keyof typeof pkg.config.entrypoints) {
  const root = await getRoot();
  return path.resolve(root, path.normalize(pkg.config.entrypoints[name]));
}

export function showStats(stats: Stats, info: Info | undefined) {
  if (stats.hasWarnings() && info?.warnings) {
    console.warn(info.warnings);
  }
  process.stdout.write(
    stats.toString({
      colors: true,
      children: true,
      cached: true,
      modules: true,
      entrypoints: true,
      hash: true,
      version: true,
      builtAt: true,
      cachedAssets: true,
      env: true,
      assetsSort: "size",
      timings: true,
      assets: true,
      assetsSpace: 11,
      runtimeModules: true,
    })
  );
  process.stdout.write("\n");
}

export function hashed(cts: crypto.BinaryLike, algorithm: string = "md5") {
  const hash = crypto.createHash(algorithm);
  hash.update(cts);
  return hash.digest("hex");
}

function hashedFilename({
  contents,
  name,
  digestLength,
}: HashedFileOptions): string {
  const ext = path.extname(name);
  const baseName = path.basename(name).replace(ext, "");
  const digest = hashed(contents).slice(digestLength);
  return [baseName, digest, ext.slice(1)].join(".");
}

async function writeHashedFile(
  p: string,
  options: WriteHashedFileOptions
): Promise<string> {
  const dir = path.dirname(p);
  const outputName = hashedFilename({ ...options, name: p });
  const outputPath = path.join(dir, outputName);
  await fs.writeFile(outputPath, options.contents, { encoding: "utf-8" });
  return outputPath;
}

export async function buildCSS() {
  log("Building CSS");
  const styleFile = await getEntrypoint("styles");
  const [{ default: config }, styleCts, assetsDir] = await Promise.all([
    import("../postcss.config"),
    fs.readFile(styleFile, "utf-8"),
    getAssetsDir(),
  ]);
  const processor = postcss(config.plugins);
  const result = await processor.process(styleCts, {
    from: styleFile,
    to: assetsDir,
    map: config.map,
  });
  const warnings = result.warnings();
  if (warnings.length > 0) {
    warnings.forEach((warning) => process.stderr.write(warning.toString()));
  }
  const { css } = result;
  const hashedOpts: HashedFileOptions = {
    name: "style.css",
    contents: css,
    digestLength,
  };
  const outName = !env.PROD ? "style.css" : hashedFilename(hashedOpts);
  const outFile = path.join(assetsDir, outName);
  await fs.writeFile(outFile, css);
  log("Done with CSS");
  return [outFile];
}

export async function buildTS() {
  log("Building TS");
  const metafileName = "metafile.json";
  const main = await getEntrypoint("main");
  const outputDir = await getOutputDir();
  const assetsDir = await getAssetsDir();
  const options: esbuild.BuildOptions = {
    entryPoints: [main],
    minify: env.PROD,
    bundle: true,
    outdir: assetsDir,
    splitting: true,
    format: "esm",
    target: "es2017",
    metafile: path.join(outputDir, metafileName),
    write: false,
    // sourcemap: "inline",
  };
  // log("esbuild options: %O", options);
  const { warnings, outputFiles } = await esbuild.build(options);
  if (warnings.length > 0) {
    warnings.forEach((warning) => process.stderr.write(warning.toString()));
  }
  if (!outputFiles) {
    return;
  }
  const realOutputPaths = outputFiles.map(({ contents, path: p }) => {
    if (!env.PROD || path.basename(p) === metafileName) {
      return { contents, p };
    } else {
      const hashedPath = hashedFilename({ contents, digestLength, name: p });
      return { contents, p: path.join(assetsDir, hashedPath) };
    }
  });
  await Promise.all(
    realOutputPaths.map(({ contents, p }) => {
      return fs.writeFile(p, contents);
    })
  );
  log("Done with TS");
  return realOutputPaths.map(({ p }) => p);
}

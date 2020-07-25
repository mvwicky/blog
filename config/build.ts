import * as path from "path";

import * as esbuild from "esbuild";

import * as pkg from "../package.json";

const rootDir = path.dirname(__dirname);

function getEntries() {
  const entrypoints = Object.entries(pkg.config.entrypoints);

  const entries = entrypoints
    .filter(([_, loc]) => /\.(ts|js)$/.test(loc))
    .map(([_, loc]) => path.resolve(rootDir, loc));
  return entries;
}

async function serviceBuild(service: esbuild.Service) {
  const opts: esbuild.BuildOptions = {
    entryPoints: getEntries(),
    outdir: path.resolve(rootDir, "dist", "assets"),
    logLevel: "info",
    bundle: true,
    target: "es2017",
    sourcemap: "external",
    format: "esm",
  };
  try {
    await service.build(opts);
  } catch (error) {
    console.error(error);
    service.stop();
    process.exit(1);
  } finally {
    service.stop();
  }
}

async function build() {
  const opts: esbuild.BuildOptions = {
    entryPoints: getEntries(),
    outdir: path.resolve(rootDir, "dist", "assets"),
    logLevel: "info",
    bundle: true,
    target: "es2017",
    sourcemap: false,
    format: "esm",
    platform: "browser",
    metafile: path.resolve(rootDir, "dist", "assets", "manifest.json"),
  };
  try {
    const result = await esbuild.build(opts);
    console.log(result);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

(async function () {
  await build();
})();

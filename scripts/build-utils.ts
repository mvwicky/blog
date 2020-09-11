import webpack from "webpack";
import type { Configuration, Stats } from "webpack";

import { env } from "../lib";

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
    excludeAssets: (asset) => !/\.(js|css)$/.test(asset),
  });
  process.stdout.write(statsString);
  process.stdout.write("\n");
}

import * as path from "path";

import findUp from "find-up";
import mem from "mem";
import type { Configuration, Stats } from "webpack";

import { env, logger } from "../lib";

const log = logger("assets", true);

export const ROOT = path.dirname(__dirname);

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

export const getRoot = mem(_getRoot);

export async function getWebpackConfig(): Promise<Configuration> {
  const conf = env.PROD
    ? import("../webpack.prod")
    : import("../webpack.config");
  const { config } = await conf;
  return config;
}

export function makeRunHandler(config: Configuration) {
  return runHandler.bind(null, config);
}

export function runHandler(config: Configuration, err?: Error, stats?: Stats) {
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
  if (stats && info) {
    showStats(config, stats, info);
  }
}

export function showStats(
  config: Configuration,
  stats: Stats,
  info: Info | undefined
) {
  if (stats.hasWarnings() && info?.warnings) {
    console.warn(info.warnings);
  }
  process.stdout.write(stats.toString(config.stats));
  process.stdout.write("\n");
}

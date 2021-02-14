import * as path from "path";
import * as util from "util";

import type { Debugger } from "debug";
import findUp from "find-up";
import mem from "mem";
import type { Configuration, Stats, StatsCompilation } from "webpack";

import { env, logger } from "../lib";

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

export function makeRunHandler(config: Configuration) {
  return runHandler.bind(null, config);
}

export function runHandler(config: Configuration, err?: Error, stats?: Stats) {
  const info: StatsCompilation | undefined = stats?.toJson();
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
  info: StatsCompilation | undefined
) {
  if (stats.hasWarnings() && info?.warnings) {
    const { length } = info.warnings;
    log("%d warning%s generated", length, length === 1 ? "" : "s");
  }
  process.stdout.write(stats.toString(config.stats));
  process.stdout.write("\n");
}

type TimeableFunc = () => void | Promise<unknown>;

export async function timeCall<F extends TimeableFunc>(d: Debugger, f: F) {
  const start = process.hrtime.bigint();
  const res = f();
  if (util.types.isPromise(res)) {
    await res;
  }
  const elapsed = Number(process.hrtime.bigint() - start);
  const elapsedStr = (elapsed / 1e9).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  d("Elapsed: %s seconds", elapsedStr);
}

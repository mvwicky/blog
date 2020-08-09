import * as util from "util";

import webpack from "webpack";

import { env, logger } from "../lib";

const log = logger("assets", true);

log("NODE_ENV=%s", env.NODE_ENV);

async function getConfig(): Promise<webpack.Configuration> {
  const conf = env.PROD
    ? import("../webpack.prod")
    : import("../webpack.config");
  const { config } = await conf;
  return config;
}

function handleStats(stats: webpack.Stats) {
  const info = stats.toJson();
  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }
  const statsString = stats.toString({
    all: false,
    timings: true,
    assets: true,
    colors: true,
    excludeAssets: (asset) => !/\.(js|css)$/.test(asset),
  });
  process.stdout.write(statsString);
  process.stdout.write("\n");
}

async function build() {
  const config = await getConfig();
  const compiler = webpack(config);
  const run = util.promisify(compiler.run.bind(compiler));
  try {
    const stats = await run();
    handleStats(stats);
  } catch (e) {
    console.error(e.stack || e);
    if (e.details) {
      console.error(e.details);
    }
  }
}

(async function () {
  await build();
})();

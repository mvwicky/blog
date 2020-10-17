import * as path from "path";

import webpack from "webpack";

import { env, logger } from "../lib";
import * as utils from "./build-utils";

const log = logger("assets", true);

log("NODE_ENV=%s", env.NODE_ENV);

async function build() {
  const config = await utils.getWebpackConfig();
  const compiler = webpack(config);
  compiler.run((err, stats) => {
    utils.runHandler(err, stats);
    compiler.close(() => {
      console.log("");
      log("Closed");
    });
  });
}

async function buildNotWebpack() {
  const root = await utils.getRoot();
  const assetsDir = await utils.getAssetsDir(true);
  log("Assets: %s", assetsDir);
  const [cssOutput, jsOutput] = await Promise.all([
    utils.buildCSS(),
    utils.buildTS(),
  ]);
  if (jsOutput) {
    log("Wrote:");
    cssOutput.concat(jsOutput).forEach((p) => {
      log("- %s", path.relative(root, p));
    });
  }
}

(async function () {
  await build();
})();

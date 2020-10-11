import webpack from "webpack";

import { env, logger } from "../lib";
import * as utils from "./build-utils";

const log = logger("assets", true);

log("NODE_ENV=%s", env.NODE_ENV);

async function build() {
  const config = await utils.getWebpackConfig();
  const compiler = webpack(config);
  compiler.run(utils.runHandler);
}

(async function () {
  await build();
  // await utils.buildTS();
})();

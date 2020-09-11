import webpack from "webpack";

import { env, logger } from "../lib";
import { getConfig, runHandler } from "./build-utils";

const log = logger("assets", true);

log("NODE_ENV=%s", env.NODE_ENV);

async function build() {
  const config = await getConfig();
  const compiler = webpack(config);
  compiler.run(runHandler);
}

(async function () {
  await build();
})();

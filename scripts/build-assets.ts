import webpack from "webpack";

import { logger } from "../lib";
import * as utils from "./build-utils";

const log = logger("assets", true);

async function build() {
  const config = await utils.getWebpackConfig();
  const compiler = webpack(config);
  const runHandler = utils.makeRunHandler(config);
  compiler.run((err, stats) => {
    runHandler(err, stats);
    compiler.close(() => {
      console.log("");
      log("Closed");
    });
  });
}

(async function () {
  await build();
})();

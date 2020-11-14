import webpack from "webpack";
import type { Compilation, Compiler, Configuration, Stats } from "webpack";

import { env, logger } from "../lib";
import { getWebpackConfig, makeRunHandler } from "./build-utils";

const log = logger("assets", true);

log("NODE_ENV=%s", env.NODE_ENV);

class WatchWrapper {
  readonly #compiler: Compiler;
  readonly #runHandler: (err?: Error, stats?: Stats) => void;
  #lastHash?: string = undefined;
  #buildStart: bigint = 0n;

  constructor(config: Configuration) {
    this.#runHandler = makeRunHandler(config);
    this.#compiler = webpack(config);
  }

  start() {
    this.#compiler.hooks.watchRun.intercept({
      call: this.watchRunCall.bind(this),
    });
    this.#compiler.hooks.afterEmit.intercept({
      call: this.afterEmitCall.bind(this),
    });
    const watch = this.#compiler.watch({}, this.watchHandler.bind(this));
    const close = () => {
      watch.close(() => {
        log("Closing Watcher");
      });
    };
    process.on("SIGINT", close);
    process.on("SIGTERM", close);
  }

  private watchRunCall(comp: Compiler) {
    this.#buildStart = process.hrtime.bigint();
  }

  private afterEmitCall(comp: Compilation) {
    if (!comp.hash || this.#lastHash !== comp.hash) {
      const elapsed = process.hrtime.bigint() - this.#buildStart;
      const elapsedSec = Number(elapsed) / 1e9;
      log("Rebuilt in %ss", elapsedSec.toPrecision(2));
    }
  }

  private watchHandler(err?: Error, stats?: Stats) {
    if (!stats?.hash || this.#lastHash !== stats.hash) {
      this.#runHandler(err, stats);
    }
    this.#lastHash = stats?.hash;
  }
}

async function watch() {
  const config = await getWebpackConfig();
  const watcher = new WatchWrapper(config);
  watcher.start();
}

(async function () {
  watch();
})();

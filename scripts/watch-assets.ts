import webpack from "webpack";
import type { Compiler, Configuration, Stats, compilation } from "webpack";

import { env, logger } from "../lib";
import { getWebpackConfig, runHandler } from "./build-utils";

type Compilation = compilation.Compilation;

const log = logger("watch", true);

log("NODE_ENV=%s", env.NODE_ENV);

const REBUILD_MSG = "  Rebuilding";
const REBUILD_LEN = REBUILD_MSG.length;

class WatchWrapper {
  readonly #compiler: Compiler;
  readonly #out: NodeJS.WriteStream;
  #lastHash?: string = undefined;
  #buildStart: bigint = 0n;

  constructor(config: Configuration, stdout: NodeJS.WriteStream) {
    this.#out = stdout;
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
    this.#out.write(REBUILD_MSG);
  }

  private afterEmitCall(comp: Compilation) {
    if (!comp.hash || this.#lastHash !== comp.hash) {
      this.#out.write("\n");
      const elapsed = process.hrtime.bigint() - this.#buildStart;
      const elapsedSec = Number(elapsed) / 1e9;
      log("Elapsed %s", elapsedSec.toPrecision(2));
    } else {
      this.#out.clearLine(-1, () => this.#out.moveCursor(-REBUILD_LEN, 0));
    }
  }

  private watchHandler(err: Error, stats: Stats) {
    if (!stats.hash || this.#lastHash !== stats.hash) {
      log("Rebuilt");
      runHandler(err, stats);
    }
    this.#lastHash = stats.hash;
  }
}

async function watch() {
  const config = await getWebpackConfig();
  const watcher = new WatchWrapper(config, process.stdout);
  watcher.start();
}

(async function () {
  watch();
})();

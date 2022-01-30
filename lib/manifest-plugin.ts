import * as path from "path";

import * as fse from "fs-extra";
import { Chunk, Compilation, Compiler, Configuration, sources } from "webpack";

import { env, logger } from ".";

export type StatsOptions = Exclude<
  Configuration["stats"],
  undefined | string | boolean
>;

interface ManifestEntry {
  name: string;
  path: string;
}

interface Manifest {
  [k: string]: string;
}

interface Options {
  publicPath?: string;
  outputPath?: string;
  outputName: string;
}
type Dict<T> = Record<string, T>;

const log = logger("plugin", true);

const emitCount = new Map<string, number>();

export class ManifestPlugin {
  private readonly options: Options;
  private watching: boolean = false;

  constructor(options: Partial<Options>) {
    this.options = { outputName: "manifest.json", ...options };
  }

  apply({ options, hooks }: Compiler): void {
    const name = ManifestPlugin.constructor.name;
    this.watching = options.watch ?? false;
    const emitOptions = { name, stage: Infinity };
    const emit = this.emit.bind(this);
    hooks.emit.tapPromise(emitOptions, emit);
  }

  private async emit(compilation: Compilation) {
    console.time("emit");
    const { output } = compilation.options;
    const publicPath = this.options.publicPath ?? output.publicPath;
    const outputPath = this.options.outputPath ?? output.path;
    if (typeof outputPath === "undefined") {
      throw new TypeError("No output path.");
    }
    if (typeof publicPath !== "string") {
      throw new TypeError(
        "Don't know how to deal with an undefined public path."
      );
    }
    const files = Array.from(compilation.chunks, (chunk) =>
      this.chunkToFiles(chunk)
    ).flat();
    files.sort((a, b) => b.path.localeCompare(a.path));
    const manifest: Manifest = files.reduce(
      (m, { path, name }) => ({ [name]: `${publicPath}${path}`, ...m }),
      {}
    );
    await this.writeManifest(outputPath, manifest);
    console.timeEnd("emit");
  }

  private chunkToFiles(chunk: Chunk): ManifestEntry[] {
    const chunkName = chunk.name || null;
    return Array.from(chunk.files, (file) => {
      const name = chunkName ? `${chunkName}.${this.getFileType(file)}` : file;
      return { path: file, name };
    });
  }

  private async writeManifest(outputPath: string, manifest: Manifest) {
    const contents = JSON.stringify(manifest, undefined, 2);
    const outputFile = path.join(outputPath, this.options.outputName);
    const exists = await (env.PROD
      ? Promise.resolve(false)
      : fse.pathExists(outputFile));
    let shouldWrite: boolean = true;
    if (exists) {
      const current = await fse.readFile(outputFile, { encoding: "utf-8" });
      shouldWrite = current !== contents;
    }
    if (shouldWrite) {
      // log("%O", manifest);
      await fse.outputFile(outputFile, contents, { encoding: "utf-8" });
    } else if (this.watching) {
      log("Touching manifest");
      const now = new Date();
      await fse.utimes(outputFile, now, now);
    }
    return new sources.RawSource(contents);
  }

  private getFileType(s: string) {
    s = s.replace(/\?.*/, "");
    const split = s.split(".");
    return split[split.length - 1];
  }
}

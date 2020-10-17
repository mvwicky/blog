import { promises as fsp } from "fs";
import * as path from "path";

import { Chunk, Compilation, Compiler, Configuration } from "webpack";

import { logger } from ".";

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

const log = logger("plugin", true);

export class ManifestPlugin {
  private readonly options: Options;
  constructor(options: Partial<Options>) {
    this.options = { outputName: "manifest.json", ...options };
  }

  apply(compiler: Compiler): void {
    const afterEmit = this.afterEmit.bind(this);
    compiler.hooks.afterEmit.tapPromise("ManifestPlugin", afterEmit);
  }

  private async afterEmit(compilation: Compilation) {
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
      {} as Manifest
    );
    await this.writeManifest(outputPath, manifest);
  }

  private chunkToFiles(chunk: Chunk): ManifestEntry[] {
    const chunkName = chunk.name || null;
    return Array.from(chunk.files, (file) => {
      const name = chunkName ? `${chunkName}.${this.getFileType(file)}` : file;
      return { path: file, name };
    });
  }

  private async writeManifest(outputPath: string, manifest: Manifest) {
    log("%O", manifest);
    const contents = JSON.stringify(manifest, undefined, 2);
    const outputFile = path.join(outputPath, this.options.outputName);
    await fsp.writeFile(outputFile, contents, { encoding: "utf-8" });
  }

  private getFileType(s: string) {
    s = s.replace(/\?.*/, "");
    const split = s.split(".");
    return split[split.length - 1];
  }
}

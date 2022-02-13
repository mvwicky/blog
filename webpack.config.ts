import { join, resolve } from "path";

import globby from "globby";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type { Configuration, Entry, RuleSetRule } from "webpack";
import { DefinePlugin } from "webpack";

import { compact, env, logger } from "./lib";
import { ManifestPlugin } from "./lib/manifest-plugin";
import { config } from "./package.json";

const log = logger("webpack");

log("NODE_ENV=%s", env.NODE_ENV);

const ROOT = process.cwd(); // __dirname;
function relToRoot(...args: string[]): string {
  log("relToRoot(%o) -> %s", args, resolve(ROOT, ...args));
  return resolve(ROOT, ...args);
}

const SRC = relToRoot("src");
const OUT = relToRoot("dist", "assets");

const publicPath = "/assets/";

const relToSrc = (...args: string[]) => join(SRC, ...args);

const globs = [relToRoot("*.config.js")];
const dependencies = globby.sync(globs, { absolute: true });

const bpElem = (name: string, width: number) =>
  [`BREAKPOINT_${name.toUpperCase()}`, width] as [string, number];
const breakpoints = Object.fromEntries(
  Object.entries(config.ui.breakpoints).map(([k, v]) => bpElem(k, v))
);

const contenthash = env.prodOr(".[contenthash]", "");
const getFilename = (ext: string) => `[name]${contenthash}.${ext}`;

const mode = env.prodOr("production", "development");

const defs = Object.fromEntries(
  Object.entries({
    "process.env.NODE_ENV": mode,
    NODE_ENV: mode,
    PRODUCTION: env.prodOr(true, false),
    ...breakpoints,
  }).map(([name, value]) => [name, JSON.stringify(value)])
);

const plugins: Configuration["plugins"] = [
  new MiniCssExtractPlugin({
    filename: getFilename("css"),
    chunkFilename: getFilename("css"),
  }),
  new ManifestPlugin({ publicPath }),
  new DefinePlugin(defs),
];

const entries = Object.entries(config.entrypoints);
const entryEntries = entries.map(([name, loc]) => [name, relToRoot(loc)]);
const entry: Entry = Object.fromEntries(entryEntries);

const { BUNDLE_FONTS } = env.env;

const rules: (RuleSetRule | null)[] = [
  {
    test: /\.(ts)$/,
    include: [relToSrc("ts")],
    exclude: [/node_modules/],
    use: [
      {
        loader: require.resolve("babel-loader"),
        options: {
          presets: compact([
            env.prodOr(
              [
                "@babel/preset-env",
                {
                  corejs: { version: "3.21", proposals: true },
                  debug: env.defined("BABEL_ENV_DEBUG"),
                  useBuiltIns: "usage",
                  targets: { esmodules: true },
                  bugfixes: true,
                  exclude: ["@babel/plugin-transform-template-literals"],
                },
              ],
              undefined
            ),
            ["@babel/preset-typescript", { onlyRemoveTypeImports: true }],
          ]),
          plugins: [["@babel/plugin-transform-runtime", {}]],
          cacheDirectory: false,
        },
      },
    ],
  },
  {
    test: /\.(css)$/,
    include: [relToSrc("css")],
    use: [
      { loader: MiniCssExtractPlugin.loader },
      {
        loader: require.resolve("css-loader"),
        options: {
          import: false,
          modules: false,
          importLoaders: 1,
          url: BUNDLE_FONTS,
        },
      },
      { loader: require.resolve("postcss-loader") },
    ],
  },
  {
    test: /\.(css)$/,
    include: [relToRoot("node_modules", "tippy.js")],
    use: [
      { loader: MiniCssExtractPlugin.loader },
      {
        loader: require.resolve("css-loader"),
        options: { import: false, modules: false },
      },
    ],
  },
  BUNDLE_FONTS
    ? {
        test: /\.woff2?$/,
        include: [relToSrc("css", "theme")],
        type: "asset",
        generator: {
          filename: `fonts/[name]${contenthash}[ext]`,
          publicPath,
        },
      }
    : null,
];

const configuration: Configuration = {
  mode,
  entry,
  context: ROOT,
  output: {
    path: OUT,
    filename: getFilename("js"),
    chunkFilename: `chunks/${getFilename("js")}`,
    hashFunction: "md5",
    hashDigestLength: 25,
    publicPath,
  },
  devtool: env.prodOr("source-map", false),
  plugins,
  module: { rules: compact<RuleSetRule>(rules) },
  stats: {
    assets: true,
    assetsSort: "size",
    builtAt: true,
    cachedAssets: true,
    children: false,
    colors: true,
    entrypoints: true,
    env: true,
    excludeModules: [/[\\/]fonts[\\/]/, /node_modules/],
    hash: true,
    modules: false,
    version: true,
    warnings: true,
    outputPath: true,
  },
  resolve: { extensions: [".ts", "..."] },
  recordsPath: relToSrc(`records-${env.prodOr("prod", "dev")}.json`),
  node: false,
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
      lib: dependencies,
    },
    version: "1.0.0",
  },
  performance: {
    hints: env.PROD ? "warning" : false,
    assetFilter: (asset: string) => /\.(js|css)$/.test(asset),
  },
  watchOptions: {
    ignored: ["**/node_modules", "**/site"],
  },
  target: "web",
};

export { configuration };
export default configuration;

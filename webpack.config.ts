import { dirname, join, resolve } from "path";

import globby from "globby";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type { Configuration, Entry } from "webpack";
import { DefinePlugin } from "webpack";

import { compact, env, logger } from "./lib";
import { ManifestPlugin } from "./lib/manifest-plugin";
import { config } from "./package.json";

const log = logger("webpack");

log("NODE_ENV=%s", env.NODE_ENV);

const ROOT = __dirname;
const relToRoot = (...args: string[]) => resolve(ROOT, ...args);

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

const [hashFunction, hashDigestLength] = ["md5", 25];
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

const configuration: Configuration = {
  mode,
  entry,
  output: {
    path: OUT,
    filename: getFilename("js"),
    chunkFilename: getFilename("js"),
    hashFunction,
    hashDigestLength,
    publicPath,
  },
  devtool: env.prodOr("source-map", false),
  plugins,
  module: {
    rules: [
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
                      corejs: { version: "3.9", proposals: true },
                      debug: env.defined("BABEL_ENV_DEBUG"),
                      useBuiltIns: "usage",
                      targets: { esmodules: true },
                      bugfixes: true,
                      exclude: ["@babel/plugin-transform-template-literals"],
                    },
                  ],
                  undefined
                ),
                "@babel/preset-typescript",
              ]),
              plugins: [["@babel/plugin-transform-runtime", {}]],
              cacheDirectory: false,
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        include: [
          relToSrc("css"),
          relToSrc("ts"),
          relToRoot("node_modules", "tippy.js"),
        ],
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: require.resolve("css-loader"),
            options: {
              import: false,
              modules: false,
              importLoaders: 1,
              url: false,
            },
          },
          { loader: require.resolve("postcss-loader") },
        ],
      },
      // {
      //   test: /\.(woff2?)$/,
      //   exclude: [/node_modules/],
      //   include: [relToSrc("css")],
      //   type: "asset/resource",
      //   generator: {
      //     filename: `fonts/[name]${contenthash}[ext]`,
      //   },
      // },
    ],
  },
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
  optimization: {
    splitChunks: {
      automaticNameDelimiter: "~",
    },
  },
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
};

export { configuration as config };
export default configuration;

import * as path from "path";

import globby from "globby";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type { Configuration, Entry } from "webpack";
import { DefinePlugin } from "webpack";

import { env, logger } from "./lib";
import { ManifestPlugin } from "./lib/manifest-plugin";
import * as pkg from "./package.json";

const log = logger("webpack", true);

log("NODE_ENV=%s", env.NODE_ENV);

function prodOr<P = any, D = any>(pVal: P, dVal: D): P | D {
  return env.PROD ? pVal : dVal;
}

const rootDir = __dirname;
const srcDir = path.resolve(rootDir, "src");
const outPath = path.resolve(rootDir, "dist", "assets");

const hashFn = "md5";
const hashLen = 24;
const fontHash = `${hashFn}:hash:hex:${hashLen}`;
const fontName = prodOr(`[name].[${fontHash}].[ext]`, "[name].[ext]");

const relToRoot = (...args: string[]) => path.resolve(rootDir, ...args);
const relToSrc = (...args: string[]) => path.join(srcDir, ...args);

const globs = ["./lib/**/*.ts", "./*.config.js", "./scripts/*.ts"];
const dependencies = globby.sync(globs, { absolute: true });

const defs = Object.fromEntries(
  Object.entries({
    "process.env.NODE_ENV": prodOr("production", "development"),
    NODE_ENV: prodOr("production", "development"),
    PRODUCTION: prodOr(true, false),
  }).map(([name, value]) => [name, JSON.stringify(value)])
);

const plugins: Configuration["plugins"] = [
  new MiniCssExtractPlugin({
    filename: prodOr(`[name].[contenthash:${hashLen}].css`, "[name].css"),
    chunkFilename: prodOr(`[name].[contenthash:${hashLen}].css`, "[name].css"),
  }),
  new ManifestPlugin({ publicPath: "/assets/" }),
  new DefinePlugin(defs),
];

function getEntrypoints(): Entry {
  const entrypoints = Object.entries(pkg.config.entrypoints);
  const entryEntries = entrypoints.map(([name, loc]) => [name, relToRoot(loc)]);
  return Object.fromEntries(entryEntries);
}

const config: Configuration = {
  mode: prodOr("production", "development"),
  entry: getEntrypoints(),
  output: {
    path: outPath,
    filename: prodOr("[name].[contenthash].js", "[name].js"),
    chunkFilename: prodOr("[name].[contenthash].js", "[name].js"),
    hashFunction: hashFn,
    hashDigestLength: hashLen,
    publicPath: "/assets/",
  },
  devtool: prodOr("source-map", "inline-cheap-module-source-map"),
  plugins,
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        include: [relToSrc("ts")],
        exclude: [/node_modules/],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    corejs: { version: 3, proposals: true },
                    debug: env.defined("BABEL_ENV_DEBUG"),
                    useBuiltIns: "usage",
                    targets: { esmodules: true },
                    bugfixes: true,
                    exclude: ["@babel/plugin-transform-template-literals"],
                  },
                ],
                "@babel/preset-typescript",
              ],
              plugins: [["@babel/plugin-transform-runtime", {}]],
              cacheCompression: false,
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
          { loader: MiniCssExtractPlugin.loader, options: { esModule: false } },
          {
            loader: "css-loader",
            options: { esModule: true, importLoaders: 1 },
          },
          { loader: "postcss-loader" },
        ],
      },
      {
        test: /\.(woff2?)$/,
        exclude: [/node_modules/],
        include: [relToSrc("css")],
        use: [
          {
            loader: "file-loader",
            options: {
              name: fontName,
              outputPath: "fonts",
              esModule: false,
              emitFile: true,
            },
          },
        ],
      },
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
    excludeAssets: [/\.woff2?$/, /-(\d+|italic)\./, /\.(map)$/],
    excludeModules: [/[\\/]fonts[\\/]/, /node_modules/],
    hash: true,
    modules: false,
    version: true,
    warnings: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  recordsPath: relToSrc(`records-${prodOr("prod", "dev")}.json`),
  node: false,
  optimization: {
    moduleIds: "deterministic",
    chunkIds: "deterministic",
    splitChunks: {
      automaticNameDelimiter: "-",
    },
  },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename].concat(dependencies),
      lib: [],
    },
    version: "1.0.0",
  },
  performance: {
    hints: env.PROD ? "warning" : false,
    assetFilter: (asset: string) => /\.(js|css)$/.test(asset),
  },
};

export { config };
export default config;

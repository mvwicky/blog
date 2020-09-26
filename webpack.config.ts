import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type { Configuration, Entry, Plugin } from "webpack";
import { DefinePlugin, HashedModuleIdsPlugin } from "webpack";
import ManifestPlugin from "webpack-manifest-plugin";

import type { CacheLoaderRule } from "./lib";
import { env, logger } from "./lib";
import * as pkg from "./package.json";

const log = logger("webpack", true);

log("NODE_ENV=%s", env.NODE_ENV);

function prodOr<P = any, D = any>(pVal: P, dVal: D): P | D {
  return env.PROD ? pVal : dVal;
}

const rootDir = __dirname;
const cacheBase = path.resolve(rootDir, ".cache", "build-cache");
const srcDir = path.resolve(rootDir, "src");
const outPath = path.resolve(rootDir, "dist", "assets");

const hashFn = prodOr("sha256", "md5");

const hashLen = prodOr(20, 10);
const fontHash = `${hashFn}:hash:hex:${hashLen}`;
const fontName = `[name].[${fontHash}].[ext]`;

const relToRoot = (...args: string[]) => path.resolve(rootDir, ...args);
const relToSrc = (...args: string[]) => path.join(srcDir, ...args);

function hashFile(p: string): string {
  const contents = fs.readFileSync(p, "utf-8");
  const hash = crypto.createHash("md5");
  hash.update(contents);
  return hash.digest("hex");
}

function getCacheDir(name: string): string {
  return path.join(cacheBase, prodOr("prod", "dev"), name);
}

function getCacheLoader(name: string): CacheLoaderRule {
  return {
    loader: "cache-loader",
    options: { cacheDirectory: getCacheDir(name) },
  };
}

const plugins: Plugin[] = [
  new HashedModuleIdsPlugin({
    hashDigestLength: 5,
    hashFunction: "md5",
  }),
  new MiniCssExtractPlugin({
    filename: prodOr(`style.[contenthash:${hashLen}].css`, "style.css"),
    chunkFilename: prodOr(`[name].[chunkhash:${hashLen}].css`, "[name].css"),
  }),
  new ManifestPlugin({
    publicPath: "/assets/",
    filter: (fd) => !/\.woff2?$/.test(fd.path),
  }),
  new DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  }),
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
    filename: prodOr(`[name].[contenthash].js`, "[name].js"),
    chunkFilename: prodOr("[name].[chunkhash].js", "[name].js"),
    hashFunction: hashFn,
    hashDigestLength: 20,
    publicPath: "/assets/",
  },
  devtool: prodOr("source-map", "cheap-module-eval-source-map"),
  plugins,
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        include: [relToSrc("ts")],
        exclude: [/node_modules/],
        use: [
          getCacheLoader("babel-loader"),
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
              cacheDirectory: getCacheDir("babel"),
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
          { loader: MiniCssExtractPlugin.loader },
          getCacheLoader("css-loader"),
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
    excludeAssets: [/\.woff2?$/, /-(\d+|italic)\./, /\.(map)$/],
    excludeModules: [/[\\/]fonts[\\/]/, /node_modules/],
    children: false,
    modules: false,
    entrypoints: true,
    hash: true,
    version: false,
    builtAt: false,
    cachedAssets: false,
    env: true,
    assetsSort: "size",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  recordsPath: relToSrc(`records-${prodOr("prod", "dev")}.json`),
  node: false,
  optimization: {
    splitChunks: {
      automaticNameDelimiter: "-",
    },
  },
};

export { getCacheDir, config };
export default config;

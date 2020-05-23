/* eslint-env node */

import * as path from "path";
import * as util from "util";

import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";
import ManifestPlugin from "webpack-manifest-plugin";

import * as pkg from "./package.json";

const prod = process.env.NODE_ENV === "production";

function compact<T>(arr: (T | undefined)[]): T[] {
  return arr.filter((e) => e !== undefined && typeof e !== "undefined") as T[];
}

function prodOr<P = any, D = any>(pVal: P, dVal: D): P | D {
  return prod ? pVal : dVal;
}

const cacheBase = path.resolve(__dirname, ".cache", "build-cache");

function getCacheDir(name: string): string {
  return path.join(cacheBase, `${name}-${prodOr("prod", "dev")}`);
}

const hashFn = prodOr("sha256", "md5");
const hashlength = prodOr(32, 10);
const fontHash = `${hashFn}:hash:hex:${hashlength}`;
const fontName = `[name].[${fontHash}].[ext]`;
const srcDir = path.resolve(__dirname, "src");
const outPath = path.resolve(__dirname, "dist", "assets");

const config: webpack.Configuration = {
  mode: prodOr("production", "development"),
  entry: pkg.config.entrypoints,
  output: {
    path: outPath,
    filename: `[name].[contenthash:${hashlength}].js`,
    hashFunction: "sha256",
    hashDigestLength: 64,
  },
  devtool: prodOr("source-map", "eval"),
  plugins: [
    // new CleanWebpackPlugin({
    //   cleanOnceBeforeBuildPatterns: ["*.*"],
    //   verbose: false,
    //   cleanStaleWebpackAssets: false,
    // }),
    new webpack.HashedModuleIdsPlugin({
      hashDigestLength: 8,
      hashFunction: "md5",
    }),
    new MiniCssExtractPlugin({
      filename: `style.[contenthash:${hashlength}].css`,
    }),
    new ManifestPlugin({
      publicPath: "/assets/",
      filter: (fd) => !/\.woff2?$/.test(fd.path),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        include: [path.join(srcDir, "ts")],
        exclude: [/node_modules/],
        use: [
          {
            loader: "cache-loader",
            options: {
              cacheDirectory: getCacheDir("babel-loader"),
            },
          },
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    corejs: { version: 3, proposals: true },
                    modules: false,
                    debug: false,
                    useBuiltIns: "usage",
                  },
                ],
                "@babel/preset-typescript",
              ],
              cacheDirectory: getCacheDir("babel"),
            },
          },
        ],
      },
      {
        test: /\.s?(css)$/,
        exclude: [/node_modules/],
        include: [path.resolve("src", "css")],
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "cache-loader",
            options: {
              cacheDirectory: getCacheDir("styles"),
            },
          },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
        ],
      },
      {
        test: /\.(woff2?)$/,
        exclude: [/node_modules/],
        include: [path.resolve("src", "css")],
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
    excludeAssets: [/\.(woff)$/, /-(700|italic)\./],
    excludeModules: [/[\\/]fonts[\\/]/, /node_modules/],
    children: false,
    modules: false,
    entrypoints: false,
    hash: false,
    version: false,
    builtAt: false,
    cachedAssets: false,
  },
  recordsPath: path.join(srcDir, "webpack-records.json"),
};

export default config;

/* eslint-env node */

import * as path from "path";

import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin = require("terser-webpack-plugin");
import webpack from "webpack";
import ManifestPlugin from "webpack-manifest-plugin";

import * as pkg from "./package.json";

const prod = process.env.NODE_ENV === "production";

function envDefined(key: string): boolean {
  return process.env[key] !== undefined;
}

function compact<T>(arr: (T | undefined)[]): T[] {
  return arr.filter((e) => e !== undefined && typeof e !== "undefined") as T[];
}

function prodOr<P = any, D = any>(pVal: P, dVal: D): P | D {
  return prod ? pVal : dVal;
}

const cacheBase = path.resolve(__dirname, ".cache", "build-cache");

function getCacheDir(name: string): string {
  return path.join(cacheBase, prodOr("prod", "dev"), name);
}

const hashFn = prodOr("sha256", "md5");
const hashlength = prodOr(32, 10);
const fontHash = `${hashFn}:hash:hex:${hashlength}`;
const fontName = `[name].[${fontHash}].[ext]`;
const srcDir = path.resolve(__dirname, "src");
const outPath = path.resolve(__dirname, "dist", "assets");

const relToSrc = (...args: string[]) => {
  return path.join(srcDir, ...args);
};

const config: webpack.Configuration = {
  mode: prodOr("production", "development"),
  entry: pkg.config.entrypoints,
  output: {
    path: outPath,
    filename: `[name].[contenthash:${hashlength}].js`,
    hashFunction: "sha256",
    hashDigestLength: 64,
    publicPath: "/assets/",
  },
  devtool: prodOr("source-map", "cheap-module-eval-source-map"),
  plugins: [
    new webpack.HashedModuleIdsPlugin({
      hashDigestLength: 5,
      hashFunction: "md5",
    }),
    new MiniCssExtractPlugin({
      filename: `style.[contenthash:${hashlength}].css`,
    }),
    new ManifestPlugin({
      publicPath: "/assets/",
      filter: (fd) => !/\.woff2?$/.test(fd.path),
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        include: [relToSrc("ts")],
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
                    debug: envDefined("BABEL_ENV_DEBUG"),
                    useBuiltIns: "usage",
                    targets: { esmodules: true },
                    bugfixes: true,
                    exclude: ["@babel/plugin-transform-template-literals"],
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
        test: /\.(css)$/,
        exclude: [/node_modules/],
        include: [relToSrc("css")],
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "cache-loader",
            options: {
              cacheDirectory: getCacheDir("css-loader"),
            },
          },
          { loader: "css-loader" },
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
  resolve: {
    extensions: [".ts", ".js"],
  },
  recordsPath: relToSrc(`webpack-records-${prodOr("prod", "dev")}.json`),
  node: false,
  optimization: prodOr(
    {
      minimizer: [
        new TerserPlugin({
          test: /\.m?(j|t)s(\?.*)?$/i,
          cache: getCacheDir("terser"),
          parallel: true,
          sourceMap: true,
          terserOptions: {
            ecma: 8,
            module: true,
            compress: {
              passes: 2,
              drop_debugger: true,
              drop_console: true,
              module: true,
            },
          },
        }),
      ],
    },
    undefined
  ),
};

export default config;

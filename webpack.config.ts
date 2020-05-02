import * as path from "path";

import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ManifestPlugin from "webpack-manifest-plugin";
import * as pkg from "./package.json";
import webpack from "webpack";

const prod = process.env.NODE_ENV === "production";

function compact<T>(arr: (T | undefined)[]): T[] {
  return arr.filter((e) => e !== undefined && typeof e !== "undefined") as T[];
}

function prodOr<P = any, D = any>(pVal: P, dVal: D): P | D {
  return prod ? pVal : dVal;
}

function ifProd<T>(obj: T): T | undefined {
  return prodOr(obj, undefined);
}

const hashFn = prodOr("sha256", "md5");
const hashlength = prodOr(32, 10);
const fontHash = `${hashFn}:hash:hex:${hashlength}`;
const fontName = `[name].[${fontHash}].[ext]`;
const srcDir = path.resolve(__dirname, "src");
const outPath = path.resolve(__dirname, "dist", "assets");
const layoutDir = path.resolve(__dirname, "_layouts");
const publicPath = "/dist/";

const config: webpack.Configuration = {
  mode: prodOr("production", "development"),
  entry: pkg.entrypoints,
  output: {
    path: outPath,
    filename: `[name].[contenthash:${hashlength}].js`,
    hashFunction: "sha256",
    hashDigestLength: 64,
  },
  devtool: prodOr("source-map", "eval"),
  plugins: [
    new MiniCssExtractPlugin({
      filename: `style.[contenthash:${hashlength}].css`,
    }),
    new ManifestPlugin({ publicPath: "/assets/" }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        include: path.join(srcDir, "ts"),
        use: [
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
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
        ],
      },
    ],
  },
};

export default config;

import TerserPlugin = require("terser-webpack-plugin");
import { Configuration } from "webpack";
import * as wb from "workbox-webpack-plugin";

import * as base from "./webpack.config";

const config: Configuration = {
  ...base.default,
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.m?(j|t)s(\?.*)?$/i,
        cache: base.getCacheDir("terser"),
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
  plugins: base.default.plugins?.concat([
    new wb.GenerateSW({
      swDest: "sw.js",
      cacheId: "wherewasicaching",
      cleanupOutdatedCaches: true,
      maximumFileSizeToCacheInBytes: 4e6,
    }),
  ]),
};

export default config;

import TerserPlugin = require("terser-webpack-plugin");
import webpack, { Configuration, Options } from "webpack";
import * as wb from "workbox-webpack-plugin";

import * as base from "./webpack.config";

const terser = new TerserPlugin({
  test: /\.m?(j|t)s(\?.*)?$/i,
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
});

const [maxEntries, maxAgeSeconds] = [30, 14 * 86400];
const runtimeOpts: wb.RuntimeCacheOptions = {
  cacheableResponse: { statuses: [200] },
  expiration: { maxEntries, maxAgeSeconds },
};

const sw = new wb.GenerateSW({
  swDest: "sw.js",
  cacheId: "wherewasicaching",
  cleanupOutdatedCaches: true,
  maximumFileSizeToCacheInBytes: 4e6,
  sourcemap: false,
  runtimeCaching: [
    {
      urlPattern: /\/blog\//,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "blog-posts", ...runtimeOpts },
    },
    {
      urlPattern: /\/pages\//,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "blog-pages", ...runtimeOpts },
    },
  ],
});

const baseOpt: Options.Optimization = base.default?.optimization ?? {};

const config: Configuration = {
  ...base.default,
  optimization: { ...baseOpt, minimizer: [terser] },
  plugins: base.default.plugins?.concat([sw]),
};

export default config;

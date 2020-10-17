import TerserPlugin = require("terser-webpack-plugin");
import { merge } from "webpack-merge";

import base from "./webpack.config";

const terser = new TerserPlugin({
  test: /\.m?(j|t)s(\?.*)?$/i,
  parallel: true,
  // sourceMap: true,
  terserOptions: {
    ecma: 2018,
    module: true,
    compress: {
      drop_debugger: true,
      drop_console: true,
      module: true,
    },
  },
});

const config = merge(base, {
  optimization: {
    minimize: true,
    //@ts-expect-error
    minimizer: [terser],
  },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
});

export default config;
export { config };

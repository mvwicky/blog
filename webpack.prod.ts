import TerserPlugin = require("terser-webpack-plugin");
import { merge } from "webpack-merge";

import base from "./webpack.config";

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

const config = merge(base, {
  optimization: { minimizer: [terser] },
});

export default config;
export { config };

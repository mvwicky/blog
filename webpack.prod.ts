import { merge } from "webpack-merge";

import base from "./webpack.config";

const config = merge(base, {
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
});

export default config;
export { config };

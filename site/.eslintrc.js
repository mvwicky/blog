const path = require("path");

function toAbs(...parts) {
  return path.resolve(__dirname, ...parts);
}

module.exports = {
  settings: {
    "import/resolver": {
      webpack: { config: toAbs("webpack.config.ts") },
      typescript: {
        alwaysTryTypes: true,
        project: [toAbs("tsconfig.json"), toAbs("src", "ts", "tsconfig.json")],
      },
    },
  },
  overrides: [
    {
      files: ["**/.eleventy.js", "src/**/*.js", "*.config.js"],
      env: { node: true, browser: false },
    },
    {
      files: [
        "webpack.*.ts",
        "config/**/*.ts",
        "config/**/*.js",
        "site/**/*.js",
      ],
      env: { node: true, browser: false },
      rules: {
        "import/dynamic-import-chunkname": ["off", {}],
      },
    },
    {
      files: ["src/js/sw.js"],
      env: { browser: false, serviceworker: true, node: false },
    },
  ],
};

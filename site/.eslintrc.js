module.exports = {
  settings: {
    "import/resolver": {
      webpack: { config: "./webpack.config.ts" },
      typescript: {
        alwaysTryTypes: true,
        project: ["tsconfig.json", "src/ts/tsconfig.json"],
      },
    },
  },
  overrides: [
    {
      files: [".eleventy.js", "src/**/*.js", "*.config.js"],
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

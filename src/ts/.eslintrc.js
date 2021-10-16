module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["tsconfig.json"],
  },
  env: { node: false, browser: true },
  globals: {
    PRODUCTION: "readonly",
  },
  rules: {
    "import/dynamic-import-chunkname": [
      0,
      { importFunctions: ["import"], webpackChunknameFormat: "[a-z0-9-]+" },
    ],
  },
};

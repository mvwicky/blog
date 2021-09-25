module.exports = {
  extends: "plugin:@typescript-eslint/recommended",
  env: { node: true, browser: false },
  rules: {
    "import/dynamic-import-chunkname": ["off", {}],
    "import/no-unresolved": [2, { ignore: [`node:\w+`] }],
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["tsconfig.json"],
  },
  settings: {
    "import/resolver": {
      webpack: null,
      typescript: {
        project: ["tsconfig.json"],
      },
    },
  },
};

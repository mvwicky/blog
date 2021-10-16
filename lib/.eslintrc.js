module.exports = {
  rules: {
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/no-extra-semi": "error",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/no-inferrable-types": "off",
    "no-array-constructor": "off",
    "no-empty-function": "off",
    "no-extra-semi": "off",
    "no-unused-vars": "off",
    "require-await": "off",
    "import/dynamic-import-chunkname": ["off", {}],
    "import/no-unresolved": ["error", { ignore: [`node:\w+`] }],
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
  env: { node: true, browser: false },
  extends: "plugin:@typescript-eslint/recommended",
};

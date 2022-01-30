module.exports = {
  extends: "wherewasigoing",
  rules: {
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc" },
        groups: [
          "builtin",
          "external",
          "internal",
          ["sibling", "parent"],
          "unknown",
          "index",
        ],
        "newlines-between": "always",
      },
    ],
    "no-unused-vars": "off",
  },
  env: { browser: true, es6: true },
  settings: {
    "import/cache": { lifetime: 0 },
    "import/extensions": [".js", ".ts"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
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
      files: [
        "tailwind.config.js",
        "postcss.config.js",
        ".eleventy.js",
        "webpack.*.ts",
        "config/**/*.ts",
        "config/**/*.js",
        "site/**/*.js",
      ],
      env: { node: true, browser: false },
      rules: {
        "import/no-unresolved": ["error", { caseSensitive: false }],
      },
    },
    {
      files: ["src/js/sw.js"],
      env: { browser: false, serviceworker: true, node: false },
    },
  ],
  root: true,
};

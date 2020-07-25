/* eslint-env node, commonjs */

const env = require("../../config/env");

module.exports = {
  unpublished: env.getBool("UNPUBLISHED", false),
  drafts: env.getBool("DRAFTS", false),
  future: env.getBool("FUTURE", false),
};

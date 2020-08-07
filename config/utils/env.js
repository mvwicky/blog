const { env } = require("../../lib/build");

const NODE_ENV = env.getStr("NODE_ENV", "production");

const envVars = {
  unpublished: env.getBool("UNPUBLISHED", false),
  drafts: env.getBool("DRAFTS", false),
  future: env.getBool("FUTURE", false),
  NODE_ENV,
  production: NODE_ENV === "production",
};

module.exports = { getBool: env.getBool, getStr: env.getStr, env: envVars };

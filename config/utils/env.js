const { env } = require("../../build/lib");

const envVars = {
  unpublished: env.getBool("UNPUBLISHED", false),
  drafts: env.getBool("DRAFTS", false),
  future: env.getBool("FUTURE", false),
  NODE_ENV: env.NODE_ENV,
  production: env.PROD,
  ENABLE_CRITICAL_CSS: env.getBool("ENABLE_CRITICAL_CSS", false),
};

module.exports = { getBool: env.getBool, getStr: env.getStr, env: envVars };

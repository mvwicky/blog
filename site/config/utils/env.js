const { env } = require("../../build/lib");

module.exports = { getBool: env.getBool, getStr: env.getStr, env: env.env };

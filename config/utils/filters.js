const util = require("util");

const dates = require("./dates");
const { shouldShow } = require("./should-show");

const INSPECT_ARGS = { compact: 1, getters: false };
const TO_DASH_RE = /(?:\s+)|—/g;
const REM_RE = /[—,.]/g;

/**
 * A modified slug.
 *
 * @param {string} s - a string
 * @returns {string}
 */
function extraSlug(s) {
  const lowered = String(s).trim().toLowerCase().normalize();
  const slug = encodeURIComponent(
    lowered.replace(TO_DASH_RE, "-").replace(REM_RE, "")
  );
  return slug;
}

function inspect(obj) {
  return util.inspect(obj, INSPECT_ARGS);
}

module.exports = { shouldShow, extraSlug, inspect, ...dates };

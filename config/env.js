/** @param {any[]} inputArr */
function dedupe(inputArr) {
  return inputArr.filter((val, i, arr) => arr.indexOf(val) >= i);
}

const BASE_TRUTHY = ["1", "on", "y", "yes", "true", "t"];
const BASE_FALSY = ["0", "off", "n", "no", "false", "f"];
/** @param {string} s */
function initCaps(s) {
  return s
    .charAt(0)
    .toLocaleUpperCase()
    .concat(s.length === 1 ? "" : s.substring(1));
}
/**
 * @param {string[]} arr
 * @returns {string[]}
 */
function makeCombos(arr) {
  const arrTx = arr.map((c) => c.toLocaleUpperCase()).concat(arr.map(initCaps));
  return dedupe(arr.concat(arrTx));
}

const TRUTHY = makeCombos(BASE_TRUTHY);
const FALSY = makeCombos(BASE_FALSY).concat([""]);

/**
 * @param {string} v
 * @returns {boolean}
 */
function checkTrue(v) {
  return TRUTHY.some((s) => v.localeCompare(s) === 0);
}

/**
 * @param {string} v
 * @returns {boolean}
 */
function checkFalse(v) {
  return FALSY.some((s) => v.localeCompare(s) === 0);
}

/**
 * @param {string} key
 * @param {boolean} defaultValue
 * @returns {boolean}
 */
function getBool(key, defaultValue) {
  const rValue = process.env[key];
  const value = rValue !== undefined ? rValue : defaultValue;
  if (typeof value === "string") {
    if (checkTrue(value)) {
      return true;
    } else if (checkFalse(value)) {
      return false;
    } else {
      throw new Error(
        `"${value}" is not parseable as a boolean (key: "${key}")`
      );
    }
  } else {
    return value;
  }
}

module.exports = { getBool };

/**
 * @param {string[]} arr
 * @return {string}
 */
function tasks(...arr) {
  return arr.join(" && ");
}

/**
 * @param {string} script
 * @return {string}
 */
function runBlog(script) {
  return `yarn workspace blog run ${script}`;
}

/** @type {{ [k: string]: string }} */
const hooks = {
  "pre-commit": tasks(
    runBlog("lint:eslint"),
    runBlog("lint:styles"),
    "pretty-quick --staged"
  ),
};

module.exports = { hooks };

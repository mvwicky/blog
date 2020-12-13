/**
 * @file Generate Netlify `_headers` file
 */

/**
 * @typedef {{[name: string]: string | string[]}} HeadersDef
 */

const { env } = require("../../build/lib");

const SPACE = "  ";

const MAX_AGE = env.getInt("IMMUTABLE_MAX_AGE", 24 * 60 * 60);
const LONG_CACHE = [`max-age=${MAX_AGE}`, "public", "immutable"];
const NEVER_CACHE = [
  "max-age=0",
  "private",
  "no-cache",
  "no-store",
  "must-revalidate",
];

/** @type {[string, HeadersDef][]} */
const HEADERS = [
  ["/*", { "X-Frame-Options": "DENY", "X-XSS-Protection": "1; mode=block" }],
  ["/sw.js", { "Service-Worker-Allowed": "/", "cache-control": NEVER_CACHE }],
  ["/manifest.webmanifest", { "cache-control": NEVER_CACHE }],
  ["/assets/fonts/*", { "cache-control": LONG_CACHE }],
  ["/assets/*.js", { "cache-control": LONG_CACHE }],
  ["/assets/*.css", { "cache-control": LONG_CACHE }],
  ["/blog/assets/reading-schema.json", { "content-type": "application/json" }],
];
class Headers {
  data() {
    return {
      permalink: "/_headers",
    };
  }

  /**
   * @param {string} header
   * @param {string | string[]} value
   * @returns {string}
   * @private
   */
  formatHeader(header, value) {
    const normValue = Array.isArray(value) ? value : [value];
    return normValue.map((val) => `${SPACE}${header}: ${val}`).join("\n");
  }

  /**
   * @param {HeadersDef} headers
   * @returns {string}
   * @private
   */
  formatHeaders(headers) {
    return Object.entries(headers)
      .map(([name, value]) => this.formatHeader(name, value))
      .join("\n");
  }

  render(data) {
    return HEADERS.map(([path, headers]) =>
      [path, this.formatHeaders(headers)].join("\n")
    ).join("\n\n");
  }
}

module.exports = Headers;

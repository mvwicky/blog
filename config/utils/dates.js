const { DateTime } = require("luxon");

/** @param {Date} date - a date */
function linkDate(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const mz = month < 10 ? "0" : "";
  const dz = day < 10 ? "0" : "";
  return `${year}/${mz}${month}/${dz}${day}`;
}

/** @param {Date} date - a date */
function readableDate(date) {
  const dt = DateTime.fromJSDate(date);
  // if (dt.isValid) {}
  return dt.toLocaleString(DateTime.DATE_MED);
  // console.log(`Invalid Date: ${date}`);
  // return "INVALID";
}

/**
 * https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
 *
 * @param {Date} date - a date
 * @returns {string}
 */
function htmlDateString(date) {
  // const dtStr = DateTime.fromJSDate(date).toISODate();
  // if (dtStr !== null) {
  //   return dtStr;
  // }
  // console.log(`Invalid Date: ${date}`);
  // return "INVALID";
  return DateTime.fromJSDate(date).toISODate();
}

module.exports = { linkDate, readableDate, htmlDateString };

import { DateTime } from "luxon";

/** @param date - a date */
export function linkDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const mz = month < 10 ? "0" : "";
  const dz = day < 10 ? "0" : "";
  return `${year}/${mz}${month}/${dz}${day}`;
}

export function readableDate(date: Date): string {
  const dt = DateTime.fromJSDate(date);
  return dt.toLocaleString(DateTime.DATE_MED);
}

/**
 * https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
 *
 * @param date - a date
 * @returns {string}
 */
export function htmlDateString(date: Date): string {
  return DateTime.fromJSDate(date).toISODate();
}

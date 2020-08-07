import { DateTime } from "luxon";

export function readableDate(date: Date): string {
  const dt = DateTime.fromJSDate(date);
  const dtStr = dt.toLocaleString(DateTime.DATE_MED);
  if (dtStr !== null) {
    return dtStr;
  } else {
    return "";
  }
}

export function htmlDateString(date: Date): string {
  return DateTime.fromJSDate(date).toISODate() ?? "";
}

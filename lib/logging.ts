import debug, { Debugger } from "debug";

const LOG_NS = "blog";

export function logger(name: string, enabled: boolean = false): Debugger {
  const log = debug(`${LOG_NS}:${name}`);
  log.enabled = enabled;
  return log;
}

const UNITS = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

export function humanBytes(n: number): string {
  const isNeg = n < 0;
  const prefix = isNeg ? "-" : "";
  if (isNeg) {
    n = -n;
  }
  if (n < 1) {
    const ns = n.toLocaleString();
    return `${prefix}${ns} ${UNITS[0]}`;
  }
  const exp = Math.min(Math.floor(Math.log10(n) / 3), UNITS.length - 1);
  n = Number((n / Math.pow(1000, exp)).toPrecision(3));
  const ns = n.toLocaleString();
  const unit = UNITS[exp];
  return `${prefix}${ns} ${unit}`;
}

import debug, { Debugger } from "debug";

export function logger(ns: string, enabled: boolean = false): Debugger {
  const log = debug(`blog:${ns}`);
  log.enabled = enabled;

  return log;
}

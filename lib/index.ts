export function envDefined(key: string): boolean {
  return process.env[key] !== undefined;
}

function isDef<U>(obj: U | undefined): obj is U {
  return obj !== undefined && typeof obj !== "undefined";
}

export function compact<T>(arr: (T | undefined)[]): T[] {
  return arr.filter((e) => isDef<T>(e)) as T[];
}

export * as dates from "./dates";
export * as env from "./env";
export * as helpers from "./helpers";
export * from "./logging";
export * from "./types";

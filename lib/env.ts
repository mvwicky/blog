function dedupe<T>(inputArray: T[]): T[] {
  return inputArray.filter((val, i, arr) => arr.indexOf(val) >= i);
}

const BASE_TRUTHY = ["1", "on", "y", "yes", "true", "t"] as const;
const BASE_FALSY = ["0", "off", "n", "no", "false", "f"] as const;

function initCaps(s: string): string {
  return s
    .charAt(0)
    .toLocaleUpperCase()
    .concat(s.length === 1 ? "" : s.substring(1));
}

function makeCombos(arr: Readonly<string[]>): string[] {
  const arrTx = arr.map((c) => c.toLocaleUpperCase()).concat(arr.map(initCaps));
  return dedupe(arr.concat(arrTx));
}

const TRUTHY: Readonly<string[]> = makeCombos(BASE_TRUTHY);
const FALSY: Readonly<string[]> = makeCombos(BASE_FALSY).concat([""]);

function checkTrue(v: string): boolean {
  return TRUTHY.some((s) => v.localeCompare(s) === 0);
}

function checkFalse(v: string): boolean {
  return FALSY.some((s) => v.localeCompare(s) === 0);
}

function defined(key: string): boolean {
  return process.env[key] !== undefined;
}

function rGet(key: string) {
  return process.env[key];
}

function requiredError(key: string): never {
  throw new Error(`Environment variable ${key} must be defined.`);
}

function getBool(key: string, defaultValue?: boolean): boolean {
  const value = rGet(key) ?? defaultValue;
  if (value === undefined) {
    requiredError(key);
  }
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

function getStr(key: string, defaultValue?: string): string {
  const value = rGet(key) ?? defaultValue;
  if (value === undefined) {
    requiredError(key);
  }
  return value;
}

function getNumber(key: string, defaultValue?: number | string): number {
  const value = rGet(key) ?? defaultValue;
  if (value === undefined) {
    requiredError(key);
  }
  const numVal = Number(value);
  if (Number.isNaN(numVal)) {
    throw new Error(`Unable to parse a number from ${value} for ${key}`);
  }
  return numVal;
}

function getInt(key: string, defaultValue?: number | string): number {
  const numVal = getNumber(key, defaultValue);
  if (!Number.isInteger(numVal)) {
    throw new Error(`Expected an integer value for ${key}`);
  }
  return numVal;
}

const NODE_ENV = getStr("NODE_ENV", "development");
const PROD = NODE_ENV === "production";

const env = {
  unpublished: getBool("UNPUBLISHED", false),
  drafts: getBool("DRAFTS", false),
  future: getBool("FUTURE", false),
  NODE_ENV: NODE_ENV,
  production: PROD,
  ENABLE_CRITICAL_CSS: getBool("ENABLE_CRITICAL_CSS", false),
};

export { getBool, getStr, defined, PROD, NODE_ENV, getNumber, getInt, env };

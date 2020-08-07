function dedupe<T>(inputArr: T[]): T[] {
  return inputArr.filter((val, i, arr) => arr.indexOf(val) >= i);
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

const TRUTHY = makeCombos(BASE_TRUTHY);
const FALSY = makeCombos(BASE_FALSY).concat([""]);

function checkTrue(v: string): boolean {
  return TRUTHY.some((s) => v.localeCompare(s) === 0);
}

function checkFalse(v: string): boolean {
  return FALSY.some((s) => v.localeCompare(s) === 0);
}

function getBool(key: string, defaultValue: boolean): boolean {
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

function getStr(key: string, defaultValue: string): string {
  const rValue = process.env[key];
  const value = rValue !== undefined ? rValue : defaultValue;
  if (value === undefined) {
    throw new Error(`Expected to find ${key}`);
  }
  return value;
}

export { getBool, getStr };

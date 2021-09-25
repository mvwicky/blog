import * as path from "node:path";
import * as util from "node:util";

import type { Debugger } from "debug";
import findUp from "find-up";
import mem from "mem";

export const ROOT = path.dirname(__dirname);

async function _getRoot(): Promise<string> {
  try {
    const root = await findUp("package.json");
    if (root !== undefined) {
      return path.dirname(root);
    }
  } catch (e) {
    console.error(e);
  }
  return ROOT;
}

export const getRoot = mem(_getRoot);

type TimeableFunc = () => void | Promise<unknown>;

export async function timeCall<F extends TimeableFunc>(
  d: Debugger,
  f: F
): Promise<void> {
  const start = process.hrtime.bigint();
  const res = f();
  if (util.types.isPromise(res)) {
    await res;
  }
  const elapsed = Number(process.hrtime.bigint() - start);
  const elapsedStr = (elapsed / 1e9).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  d("Elapsed: %s seconds", elapsedStr);
}

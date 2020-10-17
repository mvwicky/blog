import * as path from "path";

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

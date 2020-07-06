import { RuleSetLoader } from "webpack";

export interface EleventyConfig {}

export interface CacheLoaderRule extends RuleSetLoader {
  loader: "cache-loader";
  options: {
    cacheDirectory: string;
  };
}

export function envDefined(key: string): boolean {
  return process.env[key] !== undefined;
}

export function compact<T>(arr: (T | undefined)[]): T[] {
  return arr.filter((e) => e !== undefined && typeof e !== "undefined") as T[];
}

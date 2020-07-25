import { RuleSetLoader } from "webpack";

export interface EleventyConfig {}

export interface CacheLoaderRule extends RuleSetLoader {
  loader: "cache-loader";
  options: {
    cacheDirectory: string;
  };
}

declare module "webpack" {
  namespace Options {
    export interface SplitChunksOptions {
      automaticNameMaxLength?: number;
      enforceSizeThreshold?: boolean;
    }
  }
}

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

export interface Link {
  title: string;
  href: string;
  author: string;
}

export interface Page {
  published: boolean;
  tags: string[];
  [k: string]: any;
}

interface CollectionItemData {
  title: string;
  tags?: string[];
  [k: string]: any;
}

export interface CollectionItem {
  inputPath: string;
  fileSlug: string;
  outputPath: string;
  url: string;
  date: Date;
  data: CollectionItemData;
  templateContent: string;
}

export interface CollectionApi {
  getAll(): CollectionItem[];
  getAllSorted(): CollectionItem[];
  getFilteredByTag(tagName: string): CollectionItem[];
  getFilteredByTags(...tags: string[]): CollectionItem[];
  getFilteredByGlob(glob: string | string[]): CollectionItem[];
}
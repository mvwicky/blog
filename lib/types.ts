import { RuleSetLoader } from "webpack";

// export interface EleventyConfig {};

export interface CacheLoaderRule extends RuleSetLoader {
  loader: "cache-loader";
  options: {
    cacheDirectory: string;
  };
}

export interface Link {
  title: string;
  href: string;
  author: string;
}

export interface Page {
  published: boolean;
  tags: string[];
  [k: string]: unknown;
}

interface CollectionItemData {
  title: string;
  tags?: string[];
  [k: string]: unknown;
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

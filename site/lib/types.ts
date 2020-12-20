// export interface EleventyConfig {};

export interface CacheLoaderRule {
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

export interface Dirs {
  root: string;
  output: string;
}

export interface CriticalOptions {
  inline?: boolean;
  base?: string;
  html?: string;
  css?: string[];
  width?: number;
  height?: number;
  target?: { css: string; html: string; uncritical?: string };
  minify?: boolean;
  extract?: boolean;
  ignore?: Record<string, unknown>;
}

export interface Asset {
  url: string;
  pathname: string;
  absolutePath: string;
  relativePath: string;
  search: string;
  hash: string;
}

/** Should match the `site/_data/meta.yaml` file structure. */
export interface Meta {
  icon_sizes: string[];
  title: string;
  short_name: string;
  description: string;
  colors: { background: string; theme: string };
  url: string;
}

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

interface Icons {
  root: string;
  sizes: number[];
}

/** Should match the `site/_data/meta.yaml` file structure. */
export interface Meta {
  title: string;
  url: string;
  author: string;
  author_from: string;
  description: string;
  short_name: string;
  icons: Icons;
  colors: { background: string; theme: string };
  analytics: { scriptUrl: string; siteId: string };
}

export interface RenderArgument {
  meta: Meta;
  page: { date: Date };
}

import { env } from "../env";
import type { CollectionItem } from "../types";

export function shouldShow(item: CollectionItem): boolean {
  const { published, tags } = item.data;
  const unpub = env.unpublished;
  const drafts = env.drafts;
  const pub: boolean = unpub || Boolean(published);
  const draft: boolean = drafts || !(tags ?? []).includes("draft");
  const show = pub || draft;
  return show;
}

export * from "./format-size";

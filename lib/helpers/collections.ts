import { env } from "../env";
import type { CollectionItem } from "../types";

/**
 * Should this item be shown
 */
export function shouldShow(item: CollectionItem): boolean {
  const {
    data: { published, tags },
  } = item;
  const showUnpub = env.unpublished;
  const showDrafts = env.drafts;
  const pub: boolean = showUnpub || Boolean(published);
  const draft: boolean = showDrafts || !(tags ?? []).includes("draft");
  const show = pub || draft;
  return show;
}

import { boardKeyFromEntryId } from "../general/entry-id"

/**
 * Derives the owning board key from an icon set entry id.
 * Ids follow `icon-set-{key}-{suffix}`.
 */
export function iconSetBoardKeyFromEntryId(iconSetId: string): string | null {
  return boardKeyFromEntryId("icon-set", iconSetId)
}

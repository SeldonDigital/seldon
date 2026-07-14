import { boardKeyFromEntryId } from "../general/entry-id"

/**
 * Derives the owning board key from a font collection entry id.
 * Ids follow `font-collection-{key}-{suffix}`.
 */
export function fontCollectionBoardKeyFromEntryId(
  fontCollectionId: string,
): string | null {
  return boardKeyFromEntryId("font-collection", fontCollectionId)
}

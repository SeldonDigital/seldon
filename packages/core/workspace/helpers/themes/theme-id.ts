import { boardKeyFromEntryId } from "../general/entry-id"

/**
 * Derives the owning board key from a theme entry id.
 * Ids follow `theme-{key}-{suffix}`.
 */
export function themeBoardKeyFromEntryId(themeId: string): string | null {
  return boardKeyFromEntryId("theme", themeId)
}

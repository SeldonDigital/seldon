import { workspaceFontCollectionService } from "@seldon/core/workspace/services/font-collection/font-collection.service"
import type { Workspace } from "@seldon/core/workspace/types"

import { section } from "./section"

const SEARCH_LIMIT = 30

/**
 * Context section: Font search.
 *
 * The font.family facet takes an enabled family value, either a remote family
 * name like "Merriweather" or a local family's CSS stack, not a display name the
 * model invents. There can be many families, so this matches a query against the
 * families enabled across the workspace's font collection boards and returns each
 * as its stored value, with the display name in parentheses when it differs. The
 * model resolves a word like "serif" to a real value instead of guessing one the
 * workspace has not turned on. Falls back to nothing on no match, so the caller
 * can report a clean miss.
 */
export function searchFontsSection(
  workspace: Workspace,
  query: string,
): string[] {
  const needle = query.trim().toLowerCase()
  if (needle === "") return []

  const matches: string[] = []
  for (const family of workspaceFontCollectionService.collectWorkspaceFamilies(
    workspace,
  )) {
    const value = family.stack ?? family.name
    const haystack = `${value} ${family.name}`.toLowerCase()
    if (haystack.includes(needle)) {
      matches.push(value === family.name ? value : `${value} (${family.name})`)
    }
    if (matches.length >= SEARCH_LIMIT) break
  }

  return section(
    `Fonts matching "${query}" (set font.family to the value):`,
    matches,
  )
}

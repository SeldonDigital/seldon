import { getPresetOptionsAsLabelValue } from "@seldon/core/properties/schemas/helpers/property-options"
import type { Workspace } from "@seldon/core/workspace/types"

import { section } from "./section"

const SEARCH_LIMIT = 30

/**
 * Context section: Icon search.
 *
 * The `symbol` property takes an icon id like "seldon-plus", not a display name.
 * There are far too many icons to inline, so this matches a query against the
 * ids and labels of the icons enabled in the workspace and returns each as
 * "id (Label)". The model resolves a word like "plus" to the real id instead of
 * guessing one that renders as a missing icon. Falls back to nothing on no
 * match, so the caller can report a clean miss.
 */
export function searchIconsSection(
  workspace: Workspace,
  query: string,
): string[] {
  const needle = query.trim().toLowerCase()
  if (needle === "") return []

  const matches: string[] = []
  for (const { label, value } of getPresetOptionsAsLabelValue(
    "symbol",
    workspace,
  )) {
    const id = String(value)
    const haystack = `${id} ${label}`.toLowerCase()
    if (haystack.includes(needle)) matches.push(`${id} (${label})`)
    if (matches.length >= SEARCH_LIMIT) break
  }

  return section(`Icons matching "${query}" (set symbol to the id):`, matches)
}

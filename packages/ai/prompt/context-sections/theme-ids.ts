import type { Workspace } from "@seldon/core/workspace/types"

import { section } from "./section"

const TITLE = "Theme ids (use as themeId for set_theme_override):"

/**
 * Context section: Theme ids.
 *
 * A theme override names the theme it targets, and core rejects an id that is
 * not a real theme entry. Listing the workspace theme ids lets the model target
 * an existing theme instead of inventing one. This is the id a token override
 * writes to; the referenceable token paths live in the theme tokens section.
 */
export function themeIdsSection(workspace: Workspace): string[] {
  const themeIds = Object.keys(workspace.themes)
  return section(TITLE, themeIds.length > 0 ? [themeIds.join(", ")] : [])
}

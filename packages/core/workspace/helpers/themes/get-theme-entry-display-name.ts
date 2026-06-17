import { isThemeBoard } from "../../model/components"
import type { Workspace } from "../../types"

/**
 * Composed display name for a workspace theme entry.
 *
 * The default entry shows the board label. Every variant shows
 * `{board label} · {variant label}`. Returns undefined when the entry id is not
 * a theme board variant, so callers can fall back to the theme identity name.
 */
export function getThemeEntryDisplayName(
  entryId: string,
  workspace: Workspace,
): string | undefined {
  const themeBoards = Object.values(workspace.boards ?? {}).filter(isThemeBoard)

  for (const board of themeBoards) {
    const index = board.variants.findIndex(
      (variantRef) => variantRef.id === entryId,
    )
    if (index === -1) {
      continue
    }

    const entry = workspace.themes?.[entryId]
    if (!entry) {
      return undefined
    }

    return index === 0 ? board.label : `${board.label} · ${entry.label}`
  }

  return undefined
}

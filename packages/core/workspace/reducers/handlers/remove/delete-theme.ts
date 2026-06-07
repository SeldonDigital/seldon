import { produce } from "immer"
import type { EntryTheme } from "../../../model/entry-theme"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import type { ExtractPayload, Workspace } from "../../../../index"

function themeComponentKeyFromThemeId(themeId: string): string | null {
  const without = themeId.startsWith("theme-")
    ? themeId.slice("theme-".length)
    : null
  if (!without) return null
  const lastDash = without.lastIndexOf("-")
  if (lastDash <= 0) return null
  return without.slice(0, lastDash)
}

/** Deletes one variant `themes` entry and drops its ref from the owning theme board. */
export function deleteTheme(
  payload: ExtractPayload<"delete_theme">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId] as EntryTheme | undefined
    if (!entry || isEntryThemeDefault(entry)) return

    delete draft.themes[payload.themeId]

    const boardKey = themeComponentKeyFromThemeId(payload.themeId)
    if (!boardKey) return
    const board = draft.components[boardKey]
    if (board?.type !== "theme" || !board.variants) return
    board.variants = board.variants.filter((r) => r.id !== payload.themeId)
  })
}

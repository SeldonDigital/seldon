import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"
import { themeBoardKeyFromEntryId } from "../../../helpers/themes/theme-id"
import type { EntryTheme } from "../../../model/entry-theme"
import { isEntryThemeDefault } from "../../../model/entry-theme"

/** Deletes one variant `themes` entry and drops its ref from the owning theme board. */
export function deleteTheme(
  payload: ExtractPayload<"delete_theme">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId] as EntryTheme | undefined
    if (!entry || isEntryThemeDefault(entry)) return

    delete draft.themes[payload.themeId]

    const boardKey = themeBoardKeyFromEntryId(payload.themeId)
    if (!boardKey) return
    const board = draft.boards[boardKey]
    if (board?.type !== "theme" || !board.variants) return
    board.variants = board.variants.filter((r) => r.id !== payload.themeId)
  })
}

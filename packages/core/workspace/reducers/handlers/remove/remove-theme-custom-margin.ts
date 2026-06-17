import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { removeCustomToken } from "../shared/theme-custom-token"

/**
 * Drops a custom margin slot from a variant theme entry's `overrides.margin` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function removeThemeCustomMargin(
  payload: ExtractPayload<"remove_theme_custom_margin">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return
    removeCustomToken(entry, "margin", payload.key)
  })
}

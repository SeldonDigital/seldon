import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { removeCustomToken } from "../shared/theme-custom-token"

/**
 * Drops a custom fontSize slot from a variant theme entry's `overrides.fontSize` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function removeThemeCustomFontSize(
  payload: ExtractPayload<"remove_theme_custom_fontSize">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return
    removeCustomToken(entry, "fontSize", payload.key)
  })
}

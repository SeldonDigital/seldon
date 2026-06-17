import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { removeCustomToken } from "../shared/theme-custom-token"

/**
 * Drops a custom font slot from a variant theme entry's `overrides.font` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function removeThemeCustomFont(
  payload: ExtractPayload<"remove_theme_custom_font">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return
    removeCustomToken(entry, "font", payload.key)
  })
}

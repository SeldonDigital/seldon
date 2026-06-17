import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { removeCustomToken } from "../shared/theme-custom-token"

/**
 * Drops a custom lineHeight slot from a variant theme entry's `overrides.lineHeight` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function removeThemeCustomLineHeight(
  payload: ExtractPayload<"remove_theme_custom_lineHeight">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return
    removeCustomToken(entry, "lineHeight", payload.key)
  })
}

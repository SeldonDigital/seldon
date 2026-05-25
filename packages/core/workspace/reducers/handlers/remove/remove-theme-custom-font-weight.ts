import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { removeCustomToken } from "../shared/theme-custom-token"

/**
 * Drops a custom fontWeight slot from a variant theme entry's `overrides.fontWeight` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function removeThemeCustomFontWeight(
  payload: ExtractPayload<"remove_theme_custom_fontWeight">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return
    removeCustomToken(entry, "fontWeight", payload.key)
  })
}

import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { removeCustomToken } from "../shared/theme-custom-token"

/**
 * Drops a custom border slot from a variant theme entry's `overrides.border` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function removeThemeCustomBorder(
  payload: ExtractPayload<"remove_theme_custom_border">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return
    removeCustomToken(entry, "border", payload.key)
  })
}

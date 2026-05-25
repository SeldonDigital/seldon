import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { removeCustomToken } from "../shared/theme-custom-token"

/**
 * Drops a custom gap slot from a variant theme entry's `overrides.gap` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function removeThemeCustomGap(
  payload: ExtractPayload<"remove_theme_custom_gap">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return
    removeCustomToken(entry, "gap", payload.key)
  })
}

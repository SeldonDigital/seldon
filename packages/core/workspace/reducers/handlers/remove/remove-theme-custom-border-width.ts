import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { removeCustomToken } from "../shared/theme-custom-token"

/**
 * Drops a custom borderWidth slot from a variant theme entry's `overrides.borderWidth` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function removeThemeCustomBorderWidth(
  payload: ExtractPayload<"remove_theme_custom_borderWidth">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return
    removeCustomToken(entry, "borderWidth", payload.key)
  })
}

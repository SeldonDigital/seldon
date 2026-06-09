import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { removeCustomToken } from "../shared/theme-custom-token"

/**
 * Drops a custom scrollbar slot from a variant theme entry's `overrides.scrollbar` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function removeThemeCustomScrollbar(
  payload: ExtractPayload<"remove_theme_custom_scrollbar">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return
    removeCustomToken(entry, "scrollbar", payload.key)
  })
}

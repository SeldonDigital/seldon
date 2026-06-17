import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { removeCustomToken } from "../shared/theme-custom-token"

/**
 * Drops a custom spread slot from a variant theme entry's `overrides.spread` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function removeThemeCustomSpread(
  payload: ExtractPayload<"remove_theme_custom_spread">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return
    removeCustomToken(entry, "spread", payload.key)
  })
}

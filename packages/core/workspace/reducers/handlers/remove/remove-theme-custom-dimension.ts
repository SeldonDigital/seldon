import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { removeCustomToken } from "../shared/theme-custom-token"

/**
 * Drops a custom dimension slot from a variant theme entry's `overrides.dimension` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function removeThemeCustomDimension(
  payload: ExtractPayload<"remove_theme_custom_dimension">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return
    removeCustomToken(entry, "dimension", payload.key)
  })
}

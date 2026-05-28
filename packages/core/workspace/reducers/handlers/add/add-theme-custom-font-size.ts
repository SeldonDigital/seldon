import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { workspaceThemeService } from "../../../services"
import { buildScaleCell } from "../shared/build-scale-cell"
import { appendCustomToken } from "../shared/theme-custom-token"

/**
 * Appends a custom fontSize token (modulated step or exact length) to a variant theme entry's
 * `overrides.fontSize` bag. No-ops when the entry is missing or marked `type: "default"`.
 */
export function addThemeCustomFontSize(
  payload: ExtractPayload<"add_theme_custom_fontSize">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return

    const id = workspaceThemeService.getNextCustomTokenIdForTheme(
      draft,
      payload.themeId,
      "fontSize",
    )

    appendCustomToken(entry, "fontSize", id, buildScaleCell(payload))
  })
}

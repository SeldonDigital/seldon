import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { workspaceThemeService } from "../../../services"
import { buildScaleCell } from "../shared/build-scale-cell"
import { appendCustomToken } from "../shared/theme-custom-token"

/**
 * Appends a custom dimension token (modulated step or exact length) to a variant theme entry's
 * `overrides.dimension` bag. No-ops when the entry is missing or marked `type: "default"`.
 */
export function addThemeCustomDimension(
  payload: ExtractPayload<"add_theme_custom_dimension">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return

    const id = workspaceThemeService.getNextCustomTokenIdForTheme(
      draft,
      payload.themeId,
      "dimension",
    )

    appendCustomToken(entry, "dimension", id, buildScaleCell(payload))
  })
}

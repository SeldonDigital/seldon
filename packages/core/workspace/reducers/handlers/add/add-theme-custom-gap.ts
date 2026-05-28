import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { workspaceThemeService } from "../../../services"
import { buildScaleCell } from "../shared/build-scale-cell"
import { appendCustomToken } from "../shared/theme-custom-token"

/**
 * Appends a custom gap token (modulated step or exact length) to a variant theme entry's
 * `overrides.gap` bag. No-ops when the entry is missing or marked `type: "default"`.
 */
export function addThemeCustomGap(
  payload: ExtractPayload<"add_theme_custom_gap">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return

    const id = workspaceThemeService.getNextCustomTokenIdForTheme(
      draft,
      payload.themeId,
      "gap",
    )

    appendCustomToken(entry, "gap", id, buildScaleCell(payload))
  })
}

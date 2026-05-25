import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import { TokenType } from "../../../../themes/constants/token-type"
import type { ThemeModulation } from "../../../../themes/types"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { workspaceThemeService } from "../../../services"
import { appendCustomToken } from "../shared/theme-custom-token"

/**
 * Appends a custom modulated borderWidth token to a variant theme entry's `overrides.borderWidth` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function addThemeCustomBorderWidth(
  payload: ExtractPayload<"add_theme_custom_borderWidth">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return

    const id = workspaceThemeService.getNextCustomTokenIdForTheme(
      draft,
      payload.themeId,
      "borderWidth",
    )

    const cell: ThemeModulation = {
      type: TokenType.MODULATED,
      name: payload.name,
      intent: payload.intent,
      parameters: payload.parameters,
    }

    appendCustomToken(entry, "borderWidth", id, cell)
  })
}

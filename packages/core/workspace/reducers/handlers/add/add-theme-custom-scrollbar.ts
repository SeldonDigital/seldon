import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import { TokenType } from "../../../../themes/constants/token-type"
import type { ThemeScrollbar } from "../../../../themes/types"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { workspaceThemeService } from "../../../services"
import { appendCustomToken } from "../shared/theme-custom-token"

/**
 * Appends a custom scrollbar token to a variant theme entry's `overrides.scrollbar` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function addThemeCustomScrollbar(
  payload: ExtractPayload<"add_theme_custom_scrollbar">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return

    const id = workspaceThemeService.getNextCustomTokenIdForTheme(
      draft,
      payload.themeId,
      "scrollbar",
    )

    const cell: ThemeScrollbar = {
      type: TokenType.LOOK,
      name: payload.name,
      intent: payload.intent,
      parameters: payload.parameters,
    }

    appendCustomToken(entry, "scrollbar", id, cell)
  })
}

import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { TokenType } from "../../../../themes/constants/token-type"
import type { ThemeBackground } from "../../../../themes/types"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { workspaceThemeService } from "../../../services"
import { appendCustomToken } from "../shared/theme-custom-token"

/**
 * Appends a custom background token to a variant theme entry's `overrides.background` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function addThemeCustomBackground(
  payload: ExtractPayload<"add_theme_custom_background">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return

    const id = workspaceThemeService.getNextCustomTokenIdForTheme(
      draft,
      payload.themeId,
      "background",
    )

    const cell: ThemeBackground = {
      type: TokenType.LOOK,
      name: payload.name,
      intent: payload.intent,
      parameters: payload.parameters,
    }

    appendCustomToken(entry, "background", id, cell)
  })
}

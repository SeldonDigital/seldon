import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { TokenType } from "../../../../themes/constants/token-type"
import type { ThemeBorder } from "../../../../themes/types"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { workspaceThemeService } from "../../../services"
import { appendCustomToken } from "../shared/theme-custom-token"

/**
 * Appends a custom border token to a variant theme entry's `overrides.border` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function addThemeCustomBorder(
  payload: ExtractPayload<"add_theme_custom_border">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return

    const id = workspaceThemeService.getNextCustomTokenIdForTheme(
      draft,
      payload.themeId,
      "border",
    )

    const cell: ThemeBorder = {
      type: TokenType.LOOK,
      name: payload.name,
      intent: payload.intent,
      parameters: payload.parameters,
    }

    appendCustomToken(entry, "border", id, cell)
  })
}

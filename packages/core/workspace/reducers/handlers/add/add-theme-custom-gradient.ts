import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { TokenType } from "../../../../themes/constants/token-type"
import type { ThemeGradient } from "../../../../themes/types"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { workspaceThemeService } from "../../../services"
import { appendCustomToken } from "../shared/theme-custom-token"

/**
 * Appends a custom gradient token to a variant theme entry's `overrides.gradient` bag.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function addThemeCustomGradient(
  payload: ExtractPayload<"add_theme_custom_gradient">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return

    const id = workspaceThemeService.getNextCustomTokenIdForTheme(
      draft,
      payload.themeId,
      "gradient",
    )

    const cell: ThemeGradient = {
      type: TokenType.LOOK,
      name: payload.name,
      intent: payload.intent,
      parameters: payload.parameters,
    }

    appendCustomToken(entry, "gradient", id, cell)
  })
}

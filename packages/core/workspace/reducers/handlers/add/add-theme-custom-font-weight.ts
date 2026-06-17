import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { TokenType } from "../../../../themes/constants/token-type"
import type { ThemeExact } from "../../../../themes/types"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { workspaceThemeService } from "../../../services"
import { appendCustomToken } from "../shared/theme-custom-token"

/**
 * Appends a custom fontWeight token (exact unitless number) to a variant theme entry's
 * `overrides.fontWeight` bag. No-ops when the entry is missing or marked `type: "default"`.
 */
export function addThemeCustomFontWeight(
  payload: ExtractPayload<"add_theme_custom_fontWeight">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return

    const id = workspaceThemeService.getNextCustomTokenIdForTheme(
      draft,
      payload.themeId,
      "fontWeight",
    )

    const cell: ThemeExact = {
      type: TokenType.EXACT,
      name: payload.name,
      intent: payload.intent,
      parameters: payload.parameters,
    }

    appendCustomToken(entry, "fontWeight", id, cell)
  })
}

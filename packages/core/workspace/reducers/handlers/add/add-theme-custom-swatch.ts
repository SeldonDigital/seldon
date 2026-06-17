import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { TokenType } from "../../../../themes/constants/token-type"
import type { ThemeSwatch } from "../../../../themes/types"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { workspaceThemeService } from "../../../services"
import { appendCustomToken } from "../shared/theme-custom-token"

/**
 * Appends a custom swatch (`custom1`, `custom2`, ...) to the variant theme entry's
 * `overrides.swatch` bag. Writes the canonical `ThemeSwatch` cell with a colorspace-discriminated
 * `parameters` payload. No-ops when the target entry is missing or marked `type: "default"`.
 */
export function addThemeCustomSwatch(
  payload: ExtractPayload<"add_theme_custom_swatch">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return

    const id = workspaceThemeService.getNextCustomTokenIdForTheme(
      draft,
      payload.themeId,
      "swatch",
    )

    const cell: ThemeSwatch = {
      type: TokenType.SWATCH,
      name: payload.name,
      intent: payload.intent,
      parameters: payload.parameters,
    }

    appendCustomToken(entry, "swatch", id, cell)
  })
}

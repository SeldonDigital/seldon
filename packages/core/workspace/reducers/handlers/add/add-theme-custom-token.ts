import { produce } from "immer"

import { Workspace } from "../../../../index"
import { TokenType } from "../../../../themes/constants/token-type"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { workspaceThemeService } from "../../../services"
import type { ThemeCustomTokenSection, WorkspaceAction } from "../../types"
import { buildScaleCell } from "../shared/build-scale-cell"
import { appendCustomToken } from "../shared/theme-custom-token"

type AddThemeCustomTokenPayload = Extract<
  WorkspaceAction,
  { type: `add_theme_custom_${ThemeCustomTokenSection}` }
>["payload"]

/** Sections whose cells are compound look recipes (`TokenType.LOOK`). */
const LOOK_SECTIONS: ReadonlySet<ThemeCustomTokenSection> = new Set([
  "font",
  "border",
  "gradient",
  "shadow",
  "scrollbar",
])

/** Builds the token cell for `section` from an `add_theme_custom_*` payload. */
function buildCustomTokenCell(
  section: ThemeCustomTokenSection,
  payload: AddThemeCustomTokenPayload,
): unknown {
  const base = { name: payload.name, intent: payload.intent }

  if (section === "swatch") {
    return {
      type: TokenType.SWATCH,
      ...base,
      parameters: (payload as { parameters: unknown }).parameters,
    }
  }
  if (LOOK_SECTIONS.has(section)) {
    return {
      type: TokenType.LOOK,
      ...base,
      parameters: (payload as { parameters: unknown }).parameters,
    }
  }
  if (section === "borderWidth") {
    return {
      type: TokenType.MODULATED,
      ...base,
      parameters: (payload as { parameters: unknown }).parameters,
    }
  }
  if (section === "fontWeight" || section === "lineHeight") {
    return {
      type: TokenType.EXACT,
      ...base,
      parameters: (payload as { parameters: unknown }).parameters,
    }
  }
  return buildScaleCell(payload as Parameters<typeof buildScaleCell>[0])
}

/**
 * Appends a custom token (`custom1`, `custom2`, ...) to the variant theme entry's
 * `overrides[section]` bag. The cell shape follows the section's token table:
 * swatch, look, modulated, exact, or a discriminated scale cell. No-ops when the
 * target entry is missing or marked `type: "default"`.
 */
export function addThemeCustomToken(
  section: ThemeCustomTokenSection,
  payload: AddThemeCustomTokenPayload,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return

    const id = workspaceThemeService.getNextCustomTokenIdForTheme(
      draft,
      payload.themeId,
      section,
    )

    appendCustomToken(
      entry,
      section,
      id,
      buildCustomTokenCell(section, payload),
    )
  })
}

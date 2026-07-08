import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { getComputedTheme } from "../../../compute"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { buildScaleCell } from "../shared/build-scale-cell"
import { appendCustomToken } from "../shared/theme-custom-token"

/**
 * Resolves a scale token's current display name from the effective theme. A
 * reserved step (e.g. `cozy`) carries its label (`"Cozy"`) on the base theme,
 * not in the entry overrides, so a first-time override must read it from the
 * computed theme to avoid falling back to the raw lowercase key.
 */
function getEffectiveScaleName(
  payload: ExtractPayload<"set_theme_scale_slot">,
  workspace: Workspace,
): string | undefined {
  try {
    const theme = getComputedTheme(payload.themeId, workspace) as unknown as
      | Record<string, Record<string, { name?: string }>>
      | undefined
    return theme?.[payload.section]?.[payload.key]?.name
  } catch {
    return undefined
  }
}

/**
 * Replaces a scale-table cell (`${section}.${key}`) with a modulated step or an
 * exact px/rem length built from the payload. Replacing the whole cell means
 * switching directions never leaves a stale `step` or `unit/value`. Preserves
 * the token's existing `name`/`intent` so it keeps its label across edits.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function setThemeScaleSlot(
  payload: ExtractPayload<"set_theme_scale_slot">,
  workspace: Workspace,
): Workspace {
  const effectiveName = getEffectiveScaleName(payload, workspace)

  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]
    if (!entry || isEntryThemeDefault(entry)) return

    const sectionBag = (entry.overrides as Record<string, unknown>)[
      payload.section
    ]
    const existing =
      sectionBag && typeof sectionBag === "object"
        ? ((sectionBag as Record<string, unknown>)[payload.key] as
            | { name?: string; intent?: string }
            | undefined)
        : undefined

    const cell = buildScaleCell({
      name: existing?.name ?? effectiveName ?? payload.key,
      intent: existing?.intent,
      ...payload.value,
    })

    appendCustomToken(entry, payload.section, payload.key, cell)
  })
}

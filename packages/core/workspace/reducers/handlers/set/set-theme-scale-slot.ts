import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { buildScaleCell } from "../shared/build-scale-cell"
import { appendCustomToken } from "../shared/theme-custom-token"

/**
 * Replaces a scale-table cell (`${section}.${key}`) with a modulated step or an
 * exact px/rem length built from the payload. Replacing the whole cell means
 * switching directions never leaves a stale `step` or `unit/value`. Preserves
 * the existing cell `name`/`intent` so a token keeps its label across edits.
 * No-ops when the entry is missing or marked `type: "default"`.
 */
export function setThemeScaleSlot(
  payload: ExtractPayload<"set_theme_scale_slot">,
  workspace: Workspace,
): Workspace {
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
      name: existing?.name ?? payload.key,
      intent: existing?.intent,
      ...payload.value,
    })

    appendCustomToken(entry, payload.section, payload.key, cell)
  })
}

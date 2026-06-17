import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { isEntryThemeDefault } from "../../../model/entry-theme"
import { appendCustomToken } from "../shared/theme-custom-token"

/**
 * Renames a custom token by writing `${section}.${key}.name`. The `customN` key
 * never changes, so references stay stable. No-ops when the entry is missing,
 * marked `type: "default"`, or the target cell does not exist.
 */
export function setThemeCustomTokenName(
  payload: ExtractPayload<"set_theme_custom_token_name">,
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
        ? (sectionBag as Record<string, unknown>)[payload.key]
        : undefined
    if (!existing || typeof existing !== "object") return

    appendCustomToken(entry, payload.section, payload.key, {
      ...(existing as Record<string, unknown>),
      name: payload.name,
    })
  })
}

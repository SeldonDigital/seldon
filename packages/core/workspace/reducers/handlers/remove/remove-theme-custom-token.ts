import { produce } from "immer"

import { isEntryThemeDefault } from "../../../model/entry-theme"
import { removeCustomToken } from "../shared/theme-custom-token"

import type { Workspace } from "../../../../index"
import type { ThemeCustomTokenSection, WorkspaceAction } from "../../types"

type RemoveThemeCustomTokenPayload = Extract<
  WorkspaceAction,
  { type: `remove_theme_custom_${ThemeCustomTokenSection}` }
>["payload"]

/**
 * Drops a custom token slot from a variant theme entry's `overrides[section]` bag.
 * No-ops when the entry is missing or marked `type: "default"`. Swatch removal is
 * handled separately because it first inlines resolved colors into referencing nodes.
 */
export function removeThemeCustomToken(
  section: Exclude<ThemeCustomTokenSection, "swatch">,
  payload: RemoveThemeCustomTokenPayload,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId]

    if (!entry || isEntryThemeDefault(entry)) return
    removeCustomToken(entry, section, payload.key)
  })
}

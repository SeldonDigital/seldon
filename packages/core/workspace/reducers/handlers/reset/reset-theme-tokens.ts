import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import type { EntryTheme } from "../../../model/entry-theme"

/** Clears every token override on one `themes` entry. */
export function resetThemeTokens(
  payload: ExtractPayload<"reset_theme_tokens">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const entry = draft.themes[payload.themeId] as EntryTheme | undefined
    if (!entry) return
    entry.overrides = {}
  })
}

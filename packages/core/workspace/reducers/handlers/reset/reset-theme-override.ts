import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import { deleteOverrideAtPath } from "../../../helpers/themes/theme-override-paths"
import {
  WORKSPACE_EDITABLE_THEME_ENTRY_ID,
  ensureWorkspaceEditableThemeEntry,
} from "../../../helpers/themes/workspace-editable-theme"
import type { EntryTheme } from "../../../model/entry-theme"

/** Removes one dot-path from `overrides` on a `themes` entry. */
export function resetThemeOverride(
  payload: ExtractPayload<"reset_theme_override">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (payload.themeId === WORKSPACE_EDITABLE_THEME_ENTRY_ID) {
      ensureWorkspaceEditableThemeEntry(draft)
    }
    const entry = draft.themes[payload.themeId] as EntryTheme | undefined
    if (!entry) return
    const overrides: Record<string, unknown> = {
      ...(entry.overrides as Record<string, unknown>),
    }
    deleteOverrideAtPath(overrides, payload.path)
    entry.overrides = overrides
  })
}

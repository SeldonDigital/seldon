import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import {
  deleteOverrideAtPath,
  setOverrideAtPath,
} from "../../../helpers/general/override-paths"
import {
  WORKSPACE_EDITABLE_THEME_ENTRY_ID,
  ensureWorkspaceEditableThemeEntry,
} from "../../../helpers/themes/workspace-editable-theme"
import type { EntryTheme } from "../../../model/entry-theme"

/**
 * Writes payload.value into `workspace.themes[themeId].overrides` at payload.path.
 * Use null as value to remove that entry.
 */
export function setThemeOverride(
  payload: ExtractPayload<"set_theme_override">,
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
    if (payload.value === null) {
      deleteOverrideAtPath(overrides, payload.path)
    } else {
      setOverrideAtPath(overrides, payload.path, payload.value)
    }
    entry.overrides = overrides
  })
}

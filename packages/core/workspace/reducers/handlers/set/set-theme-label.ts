import { produce } from "immer"
import type { ExtractPayload, Workspace } from "../../../../index"
import {
  WORKSPACE_EDITABLE_THEME_ENTRY_ID,
  ensureWorkspaceEditableThemeEntry,
} from "../../../helpers/themes/workspace-editable-theme"

/**
 * Sets `workspace.themes[themeId].label`.
 */
export function setThemeLabel(
  payload: ExtractPayload<"set_theme_label">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (payload.themeId === WORKSPACE_EDITABLE_THEME_ENTRY_ID) {
      ensureWorkspaceEditableThemeEntry(draft)
    }
    const entry = draft.themes[payload.themeId]
    if (!entry) return
    entry.label = payload.label
  })
}

import { produce } from "immer"

import type { ExtractPayload, Workspace } from "../../../../index"
import {
  WORKSPACE_EDITABLE_THEME_ENTRY_ID,
  ensureWorkspaceEditableThemeEntry,
} from "../../../helpers/themes/workspace-editable-theme"

/**
 * Sets or clears `workspace.themes[themeId].__editor`.
 */
export function setThemeEditorData(
  payload: ExtractPayload<"set_theme_editor_data">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (payload.themeId === WORKSPACE_EDITABLE_THEME_ENTRY_ID) {
      ensureWorkspaceEditableThemeEntry(draft)
    }
    const entry = draft.themes[payload.themeId]
    if (!entry) return
    if (payload.editorData === undefined) delete entry.__editor
    else entry.__editor = payload.editorData
  })
}

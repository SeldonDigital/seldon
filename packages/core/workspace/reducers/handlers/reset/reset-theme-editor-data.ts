import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import {
  WORKSPACE_EDITABLE_THEME_ENTRY_ID,
  ensureWorkspaceEditableThemeEntry,
} from "../../../helpers/themes/workspace-editable-theme"
import type { EntryTheme } from "../../../model/entry-theme"

/** Drops editor-only metadata on one `themes` entry. */
export function resetThemeEditorData(
  payload: ExtractPayload<"reset_theme_editor_data">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (payload.themeId === WORKSPACE_EDITABLE_THEME_ENTRY_ID) {
      ensureWorkspaceEditableThemeEntry(draft)
    }
    const entry = draft.themes[payload.themeId] as EntryTheme | undefined
    if (!entry) return
    delete entry.__editor
  })
}

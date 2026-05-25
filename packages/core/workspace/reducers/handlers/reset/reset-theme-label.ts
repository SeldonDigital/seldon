import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../../index"
import { getDefaultThemeEntryLabel } from "../../../helpers/themes/default-theme-entry-label"
import type { EntryTheme } from "../../../model/entry-theme"
import {
  WORKSPACE_EDITABLE_THEME_ENTRY_ID,
  ensureWorkspaceEditableThemeEntry,
} from "../../../helpers/themes/workspace-editable-theme"

/** Restores `label` on one `themes` entry to the catalog-aligned default. */
export function resetThemeLabel(
  payload: ExtractPayload<"reset_theme_label">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    if (payload.themeId === WORKSPACE_EDITABLE_THEME_ENTRY_ID) {
      ensureWorkspaceEditableThemeEntry(draft)
    }
    const entry = draft.themes[payload.themeId] as EntryTheme | undefined
    if (!entry) return
    entry.label = getDefaultThemeEntryLabel(entry, draft)
  })
}

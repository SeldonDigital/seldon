import type { EntryTheme } from "../../model/entry-theme"
import {
  DEFAULT_THEME_ENTRY_ID,
  createDefaultThemeEntry,
} from "./seed-default-theme-board"

/** Workspace theme row id for the editor-editable theme. This is the stock default theme entry. */
export const WORKSPACE_EDITABLE_THEME_ENTRY_ID = DEFAULT_THEME_ENTRY_ID

export function ensureWorkspaceEditableThemeEntry(workspace: {
  themes?: Record<string, EntryTheme>
}): void {
  if (!workspace.themes) {
    workspace.themes = {}
  }
  if (!workspace.themes[WORKSPACE_EDITABLE_THEME_ENTRY_ID]) {
    workspace.themes[WORKSPACE_EDITABLE_THEME_ENTRY_ID] =
      createDefaultThemeEntry()
  }
}

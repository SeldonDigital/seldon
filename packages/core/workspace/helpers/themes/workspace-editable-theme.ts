import type { EntryTheme } from "../../model/entry-theme"
import { formatThemeCatalog } from "../../model/template-ref"

/** Workspace theme row id for the editor-editable theme (matches `ThemeInstanceId` `"custom"`). */
export const WORKSPACE_EDITABLE_THEME_ENTRY_ID = "custom" as const

export function createDefaultEditableThemeEntry(): EntryTheme {
  return {
    id: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
    type: "default",
    label: "Custom",
    template: formatThemeCatalog("default"),
    overrides: {},
  }
}

export function ensureWorkspaceEditableThemeEntry(
  workspace: { themes?: Record<string, EntryTheme> },
): void {
  if (!workspace.themes) {
    workspace.themes = {}
  }
  if (!workspace.themes[WORKSPACE_EDITABLE_THEME_ENTRY_ID]) {
    workspace.themes[WORKSPACE_EDITABLE_THEME_ENTRY_ID] =
      createDefaultEditableThemeEntry()
  }
}

import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { deleteOverrideAtPath } from "../../../helpers/themes/theme-override-paths"
import {
  WORKSPACE_EDITABLE_THEME_ENTRY_ID,
  ensureWorkspaceEditableThemeEntry,
} from "../../../helpers/themes/workspace-editable-theme"
import type { EntryTheme } from "../../../model/entry-theme"

function setOverrideAtPath(
  target: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  const keys = path.split(".").filter(Boolean)
  if (keys.length === 0) return
  let cur: Record<string, unknown> = target
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]!
    const next = cur[k]
    if (typeof next !== "object" || next === null || Array.isArray(next)) {
      cur[k] = {}
    }
    cur = cur[k] as Record<string, unknown>
  }
  cur[keys[keys.length - 1]!] = value
}

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

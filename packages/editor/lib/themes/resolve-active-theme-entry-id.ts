import type { EntryThemeId, Workspace } from "@seldon/core/workspace/types"

type ResolveInput = {
  workspace: Workspace
  selectedThemeEntryId: EntryThemeId | null
}

/**
 * Resolves which `workspace.themes` entry the properties sidebar should edit.
 *
 * Theme editing applies only when a theme entry (default or variant) is
 * selected. Selecting the theme board itself shows board properties instead.
 */
export function resolveActiveThemeEntryId({
  workspace,
  selectedThemeEntryId,
}: ResolveInput): EntryThemeId | null {
  if (selectedThemeEntryId && workspace.themes[selectedThemeEntryId]) {
    return selectedThemeEntryId
  }

  return null
}

export function isThemeEditingSelection(
  workspace: Workspace,
  selectedThemeEntryId: EntryThemeId | null,
): boolean {
  return (
    resolveActiveThemeEntryId({
      workspace,
      selectedThemeEntryId,
    }) !== null
  )
}

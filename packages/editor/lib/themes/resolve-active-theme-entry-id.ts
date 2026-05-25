import { isBoard } from "@seldon/core/workspace/helpers/is-board"
import { isThemeBoard } from "@seldon/core/workspace/model/components"
import type { ComponentEntry, EntryThemeId, Workspace } from "@seldon/core/workspace/types"

type ResolveInput = {
  workspace: Workspace
  selectedThemeEntryId: EntryThemeId | null
  selectedBoard: ComponentEntry | null
}

/**
 * Resolves which `workspace.themes` entry the properties sidebar should edit.
 */
export function resolveActiveThemeEntryId({
  workspace,
  selectedThemeEntryId,
  selectedBoard,
}: ResolveInput): EntryThemeId | null {
  if (selectedThemeEntryId && workspace.themes[selectedThemeEntryId]) {
    return selectedThemeEntryId
  }

  if (selectedBoard && isBoard(selectedBoard) && isThemeBoard(selectedBoard)) {
    const defaultRef = selectedBoard.variants[0]
    if (defaultRef?.id && workspace.themes[defaultRef.id]) {
      return defaultRef.id
    }
  }

  return null
}

export function isThemeEditingSelection(
  workspace: Workspace,
  selectedThemeEntryId: EntryThemeId | null,
  selectedBoard: ComponentEntry | null,
): boolean {
  return resolveActiveThemeEntryId({
    workspace,
    selectedThemeEntryId,
    selectedBoard,
  }) !== null
}

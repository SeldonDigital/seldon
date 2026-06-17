import type { Workspace } from "@seldon/core/workspace/types"

type ResolveInput = {
  workspace: Workspace
  selectedFontCollectionEntryId: string | null
}

/**
 * Resolves which `font-collections` entry the properties sidebar should show.
 *
 * Font collection editing applies only when a font collection entry (default or
 * variant) is selected. Selecting the font collection board itself shows board
 * properties instead.
 */
export function resolveActiveFontCollectionEntryId({
  workspace,
  selectedFontCollectionEntryId,
}: ResolveInput): string | null {
  if (
    selectedFontCollectionEntryId &&
    workspace["font-collections"][selectedFontCollectionEntryId]
  ) {
    return selectedFontCollectionEntryId
  }

  return null
}

export function isFontCollectionEditingSelection(
  workspace: Workspace,
  selectedFontCollectionEntryId: string | null,
): boolean {
  return (
    resolveActiveFontCollectionEntryId({
      workspace,
      selectedFontCollectionEntryId,
    }) !== null
  )
}

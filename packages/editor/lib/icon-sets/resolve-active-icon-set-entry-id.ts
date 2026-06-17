import type { Workspace } from "@seldon/core/workspace/types"

type ResolveInput = {
  workspace: Workspace
  selectedIconSetEntryId: string | null
}

/**
 * Resolves which `icon-sets` entry the properties sidebar should show.
 *
 * Icon set editing applies only when an icon set entry (default or variant) is
 * selected. Selecting the icon set board itself shows board properties instead.
 */
export function resolveActiveIconSetEntryId({
  workspace,
  selectedIconSetEntryId,
}: ResolveInput): string | null {
  if (
    selectedIconSetEntryId &&
    workspace["icon-sets"][selectedIconSetEntryId]
  ) {
    return selectedIconSetEntryId
  }

  return null
}

export function isIconSetEditingSelection(
  workspace: Workspace,
  selectedIconSetEntryId: string | null,
): boolean {
  return (
    resolveActiveIconSetEntryId({
      workspace,
      selectedIconSetEntryId,
    }) !== null
  )
}

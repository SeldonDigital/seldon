import type { IconId } from "@seldon/core/icon-sets"
import {
  getAddedIconSetPrefixes,
  getWorkspaceEnabledIcons,
  isIconUnavailable,
} from "@seldon/core/icon-sets/helpers"
import type { Workspace } from "@seldon/core/workspace/types"

type IconAvailability = {
  enabled: Set<IconId>
  addedPrefixes: Set<string>
}

/**
 * Caches the workspace enabled-icon set and added-set prefixes per workspace
 * object identity, so the union is computed once per workspace rather than once
 * per icon node.
 */
const cache = new WeakMap<Workspace, IconAvailability>()

export function getIconAvailability(workspace: Workspace): IconAvailability {
  let value = cache.get(workspace)
  if (!value) {
    value = {
      enabled: new Set(getWorkspaceEnabledIcons(workspace)),
      addedPrefixes: getAddedIconSetPrefixes(workspace),
    }
    cache.set(workspace, value)
  }
  return value
}

/**
 * True when the icon's set is in the workspace but the icon is turned off.
 * Icons whose set was never added render normally.
 */
export function isWorkspaceIconUnavailable(
  iconId: IconId | undefined,
  workspace: Workspace,
): boolean {
  if (!iconId) return false
  const { enabled, addedPrefixes } = getIconAvailability(workspace)
  return isIconUnavailable(iconId, enabled, addedPrefixes)
}

import { COLORS } from "@seldon/editor/lib/helpers/colors"
import { isDarkBackgroundColor } from "@seldon/core/helpers/color/contrast"
import { getEffectiveProperties } from "@seldon/core/helpers/properties/properties-bridge"
import { resolveColor } from "@seldon/core/helpers/resolution/resolve-color"
import { ValueType } from "@seldon/core/properties/constants"
import type { Properties } from "@seldon/core/properties/types/properties"
import type { BackgroundLayer } from "@seldon/core/properties/values/appearance/background"
import type { ColorValue } from "@seldon/core/properties/values/appearance/color"
import { findParentNode } from "@seldon/core/workspace/helpers/nodes/find-parent-node"
import { nodeRelationshipService } from "@seldon/core/workspace/services"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import type {
  Board,
  EntryNodeId,
  Workspace,
} from "@seldon/core/workspace/types"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"

export interface OutlineColors {
  hover: string
  selection: string
}

const FALLBACK_SURFACE: ColorValue = {
  type: ValueType.EXACT,
  value: "#FFFFFF",
}

export const DEFAULT_OUTLINE_COLORS: OutlineColors = {
  hover: COLORS.charcoal[400],
  selection: COLORS.charcoal[700],
}

function readBackgroundLayerColor(
  properties: Properties,
): ColorValue | undefined {
  const background = properties.background
  if (!Array.isArray(background) || background.length === 0) {
    return undefined
  }
  const layer = background[0] as BackgroundLayer | undefined
  const color = layer?.color
  // A COMPUTED background (Match Color) mirrors an ancestor surface at compute
  // time. Skip it here so the surface walk falls through to the parent chain,
  // which is the surface it would resolve to anyway. resolveColor throws on
  // COMPUTED because effective properties are not run through compute.
  if (
    !color ||
    color.type === ValueType.EMPTY ||
    color.type === ValueType.COMPUTED
  ) {
    return undefined
  }
  return color as ColorValue
}

function isOpaqueResolved(color: ReturnType<typeof resolveColor>): boolean {
  if (color.type === ValueType.EMPTY) {
    return false
  }
  if (color.type === ValueType.OPTION && color.value === "transparent") {
    return false
  }
  return true
}

function resolveSurfaceForObjectId(
  objectId: string,
  workspace: Workspace,
): ColorValue | null {
  const node = workspace.nodes[objectId as EntryNodeId]
  const board = workspace.boards[objectId]
  const subject = node ?? board
  if (!subject) {
    return null
  }

  const theme = workspaceThemeService.getObjectTheme(subject, workspace)
  const properties = getEffectiveProperties(objectId, workspace)
  const authoredColor = readBackgroundLayerColor(properties)
  if (!authoredColor) {
    return null
  }

  const resolved = resolveColor({ color: authoredColor, theme })
  return isOpaqueResolved(resolved) ? (resolved as ColorValue) : null
}

function resolveSurfaceForBoard(
  board: Board,
  workspace: Workspace,
): ColorValue {
  const boardKey = getComponentKey(board)
  return resolveSurfaceForObjectId(boardKey, workspace) ?? FALLBACK_SURFACE
}

/**
 * Resolves an opaque surface color for a node target. Checks the parent first
 * because selection outlines sit outside the node box, then the node, then the
 * owning board root.
 */
export function resolveOutlineSurfaceForNode(
  nodeId: string,
  workspace: Workspace,
): ColorValue {
  const node = workspace.nodes[nodeId as EntryNodeId]
  if (!node) {
    return FALLBACK_SURFACE
  }

  const candidateIds: string[] = []
  const parent = findParentNode(nodeId as EntryNodeId, workspace)
  if (parent) {
    candidateIds.push(parent.id)
  }
  candidateIds.push(nodeId)

  for (const id of candidateIds) {
    const surface = resolveSurfaceForObjectId(id, workspace)
    if (surface) {
      return surface
    }
  }

  let current = parent
  while (current) {
    const parentSurface = resolveSurfaceForObjectId(current.id, workspace)
    if (parentSurface) {
      return parentSurface
    }
    current = findParentNode(current.id, workspace)
  }

  const board = nodeRelationshipService.findBoardForNode(node, workspace)
  if (board) {
    return resolveSurfaceForBoard(board, workspace)
  }

  return FALLBACK_SURFACE
}

/**
 * Resolves the active board root surface for non-node canvas selections.
 */
export function resolveOutlineSurfaceForBoard(
  board: Board,
  workspace: Workspace,
): ColorValue {
  return resolveSurfaceForBoard(board, workspace)
}

/** Maps a resolved surface to hover and selection outline border colors. */
export function pickOutlineColorsFromSurface(
  surface: ColorValue,
): OutlineColors {
  try {
    const dark = isDarkBackgroundColor(surface)
    if (dark) {
      return {
        hover: COLORS.pearl[400],
        selection: COLORS.pearl[600],
      }
    }
    return DEFAULT_OUTLINE_COLORS
  } catch {
    return DEFAULT_OUTLINE_COLORS
  }
}

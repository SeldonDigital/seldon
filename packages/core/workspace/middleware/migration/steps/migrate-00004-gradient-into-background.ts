import { ValueType } from "../../../../properties/constants"
import { BackgroundKind } from "../../../../properties/values/appearance/background/background-kind"
import { isComponentBoard, isPlaygroundBoard } from "../../../model"
import type { Board } from "../../../model/components"
import type { EntryNode } from "../../../model/entry-node"
import type { Workspace } from "../../../model/workspace"

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value)
}

/** Normalizes a layered paint value (array or legacy single object) to an array. */
function toLayerArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.filter(isRecord)
  if (isRecord(value)) return [value]
  return []
}

/** Tags a former gradient layer as a gradient-kind background layer. */
function toGradientBackgroundLayer(
  layer: Record<string, unknown>,
): Record<string, unknown> {
  return {
    kind: { type: ValueType.OPTION, value: BackgroundKind.GRADIENT },
    ...layer,
  }
}

/**
 * Moves a property bag's `gradient` stack onto its `background` stack as
 * gradient-kind layers, then drops the `gradient` key. Gradients are appended
 * above existing background layers to preserve their prior "on top" paint
 * order. Bags without a `gradient` key are returned unchanged.
 */
function migratePropertyBag(
  bag: Record<string, unknown>,
): Record<string, unknown> {
  if (!("gradient" in bag)) return bag

  const gradientLayers = toLayerArray(bag.gradient).map(
    toGradientBackgroundLayer,
  )
  const backgroundLayers = toLayerArray(bag.background)

  const next = { ...bag }
  delete next.gradient

  const combined = [...backgroundLayers, ...gradientLayers]
  if (combined.length > 0) next.background = combined
  return next
}

/**
 * v4: folds the standalone `gradient` paint stack into the `background` stack as
 * gradient-kind layers. Theme `gradient` look tokens are left untouched.
 */
export function migrateV4GradientIntoBackground(
  workspace: Workspace,
): Workspace {
  const next: Workspace = {
    ...workspace,
    nodes: { ...workspace.nodes },
    boards: { ...workspace.boards },
  }

  for (const [nodeId, node] of Object.entries(next.nodes) as Array<
    [string, EntryNode]
  >) {
    next.nodes[nodeId] = {
      ...node,
      overrides: migratePropertyBag(
        node.overrides as Record<string, unknown>,
      ) as typeof node.overrides,
    }
  }

  for (const [boardKey, board] of Object.entries(next.boards) as Array<
    [string, Board]
  >) {
    if (!isComponentBoard(board) && !isPlaygroundBoard(board)) {
      continue
    }
    next.boards[boardKey] = {
      ...board,
      componentProperties: migratePropertyBag(
        board.componentProperties as Record<string, unknown>,
      ) as typeof board.componentProperties,
    }
  }

  return next
}

import { getEffectiveNodeProperties } from "../../../compute/compute-node-properties"

import type { LayeredPaintKey } from "../../../../properties"
import type { Workspace } from "../../../types"

/** One paint layer as a loose facet bag, used while rewriting a stack. */
type LayerBag = Record<string, unknown>

function toLayerArray(value: unknown): LayerBag[] {
  if (Array.isArray(value)) return value as LayerBag[]
  if (value && typeof value === "object") return [value as LayerBag]

  return []
}

/**
 * Reads the node's full effective paint stack for `property` and returns a fresh
 * array of plain layer bags with real resolved values. A structural edit
 * (add/remove/reorder/retype) writes this array back as an override, so the node
 * takes ownership of the whole stack and its count and order survive index
 * shifts. Reset drops the override to restore the baseline stack.
 */
export function readNodeLayerArray(
  nodeId: string,
  property: LayeredPaintKey,
  workspace: Workspace,
): LayerBag[] {
  const effective = toLayerArray(getEffectiveNodeProperties(nodeId, workspace)[property])

  return effective.map((slot) =>
    slot && typeof slot === "object" && !Array.isArray(slot) ? { ...slot } : {},
  )
}

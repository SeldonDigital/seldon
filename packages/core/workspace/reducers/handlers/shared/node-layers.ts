import type { LayeredPaintKey } from "../../../../properties"
import { getEffectiveNodeProperties } from "../../../compute/compute-node-properties"
import type { EntryNode, Workspace } from "../../../types"

/** One paint layer as a loose facet bag, used while rewriting a stack. */
type LayerBag = Record<string, unknown>

function toLayerArray(value: unknown): LayerBag[] {
  if (Array.isArray(value)) return value as LayerBag[]
  if (value && typeof value === "object") return [value as LayerBag]
  return []
}

/**
 * Reads the node's full effective paint stack for `property` and returns a fresh
 * array of plain layer bags. Slots the node owns are copied; slots it inherits
 * (theme/template/schema) become empty bags so defaults still show through after
 * the array is written back as an override.
 */
export function readNodeLayerArray(
  node: EntryNode,
  nodeId: string,
  property: LayeredPaintKey,
  workspace: Workspace,
): LayerBag[] {
  const own = toLayerArray((node.overrides as Record<string, unknown>)[property])
  const effective = getEffectiveNodeProperties(nodeId, workspace)[property]
  const effectiveCount = toLayerArray(effective).length
  const count = Math.max(own.length, effectiveCount)

  const layers: LayerBag[] = []
  for (let i = 0; i < count; i++) {
    const slot = own[i]
    layers.push(
      slot && typeof slot === "object" && !Array.isArray(slot) ? { ...slot } : {},
    )
  }
  return layers
}

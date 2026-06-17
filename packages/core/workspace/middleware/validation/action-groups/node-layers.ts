import {
  isLayeredPaintProperty,
  type LayeredPaintKey,
} from "../../../../properties"
import { getEffectiveNodeProperties } from "../../../compute/compute-node-properties"
import type { Action, InstanceId, VariantId, Workspace } from "../../../types"
import { check } from "../check"
import { nodeValidators } from "../validators"

function effectiveLayerCount(
  workspace: Workspace,
  nodeId: string,
  property: LayeredPaintKey,
): number {
  const value = getEffectiveNodeProperties(nodeId, workspace)[property]
  return Array.isArray(value) ? value.length : value ? 1 : 0
}

export function validateAddNodeLayer(
  workspace: Workspace,
  action: Extract<Action, { type: "add_node_layer" }>,
): void {
  const nodeId = action.payload.nodeId as InstanceId | VariantId
  nodeValidators.exists(workspace, nodeId)
  check(
    isLayeredPaintProperty(action.payload.property),
    `add_node_layer requires a layered paint property, got "${action.payload.property}"`,
  )
}

export function validateSetNodeLayerKind(
  workspace: Workspace,
  action: Extract<Action, { type: "set_node_layer_kind" }>,
): void {
  const nodeId = action.payload.nodeId as InstanceId | VariantId
  nodeValidators.exists(workspace, nodeId)
  check(
    isLayeredPaintProperty(action.payload.property),
    `set_node_layer_kind requires a layered paint property, got "${action.payload.property}"`,
  )
  const { layerIndex } = action.payload
  check(
    layerIndex === undefined || (Number.isInteger(layerIndex) && layerIndex >= 0),
    `set_node_layer_kind layerIndex must be a non-negative integer, got ${layerIndex}`,
  )
}

export function validateRemoveNodeLayer(
  workspace: Workspace,
  action: Extract<Action, { type: "remove_node_layer" }>,
): void {
  const nodeId = action.payload.nodeId as InstanceId | VariantId
  nodeValidators.exists(workspace, nodeId)
  check(
    isLayeredPaintProperty(action.payload.property),
    `remove_node_layer requires a layered paint property, got "${action.payload.property}"`,
  )
  const { index } = action.payload
  check(
    Number.isInteger(index) && index >= 1,
    `remove_node_layer cannot remove the base layer (index ${index})`,
  )
  const count = effectiveLayerCount(workspace, nodeId, action.payload.property)
  check(
    index < count,
    `remove_node_layer index ${index} is out of range (${count} layers)`,
  )
}

export function validateReorderNodeLayer(
  workspace: Workspace,
  action: Extract<Action, { type: "reorder_node_layer" }>,
): void {
  const nodeId = action.payload.nodeId as InstanceId | VariantId
  nodeValidators.exists(workspace, nodeId)
  check(
    isLayeredPaintProperty(action.payload.property),
    `reorder_node_layer requires a layered paint property, got "${action.payload.property}"`,
  )
  const { fromIndex, toIndex } = action.payload
  const count = effectiveLayerCount(workspace, nodeId, action.payload.property)
  check(
    Number.isInteger(fromIndex) && fromIndex >= 0 && fromIndex < count,
    `reorder_node_layer fromIndex ${fromIndex} is out of range (${count} layers)`,
  )
  check(
    Number.isInteger(toIndex) && toIndex >= 0 && toIndex < count,
    `reorder_node_layer toIndex ${toIndex} is out of range (${count} layers)`,
  )
}

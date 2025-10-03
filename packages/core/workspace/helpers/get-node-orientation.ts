import { ComponentId } from "../../components/constants"
import {
  Board,
  Instance,
  InstanceId,
  Orientation,
  Properties,
  ValueType,
  Variant,
  VariantId,
  Workspace,
  invariant,
} from "../../index"
import { findParentNode } from "./find-parent-node"
import { getBoardById } from "./get-board-by-id"
import { getNodeOrBoardById } from "./get-node-or-board-by-id"
import { getNodeProperties } from "./get-node-properties"
import { isBoard } from "./is-board"

/**
 * Determines the orientation of a node by checking its properties and traversing up the tree if needed.
 * @param nodeId - The ID of the node to get orientation for
 * @param workspace - The workspace containing the nodes
 * @returns The orientation as "horizontal" or "vertical"
 * @throws Error if the node is a board without orientation or has unknown orientation type
 */
export function getNodeOrientation(
  nodeId: InstanceId | VariantId | ComponentId,
  workspace: Workspace,
): "horizontal" | "vertical" {
  const node = getNodeOrBoardById(nodeId, workspace)
  const properties = getNodeProperties(node, workspace)

  if (isBoard(node)) {
    invariant(properties.orientation, "Board has no orientation property")

    return properties.orientation.type === ValueType.PRESET &&
      properties.orientation.value === Orientation.HORIZONTAL
      ? "horizontal"
      : "vertical"
  }

  if (properties?.orientation) {
    return properties.orientation.type === ValueType.PRESET &&
      properties.orientation.value === Orientation.HORIZONTAL
      ? "horizontal"
      : "vertical"
  }

  let parentProperties: Properties | null = null
  const parent: Variant | Instance | Board | null = findParentNode(
    node.id,
    workspace,
  )

  if (parent) {
    parentProperties = getNodeProperties(parent, workspace)
  } else {
    const board = getBoardById(node.component, workspace)
    parentProperties = getNodeProperties(board, workspace)
  }

  if (!parentProperties?.orientation) {
    return "vertical"
  }

  if (parentProperties.orientation.type === ValueType.PRESET) {
    return parentProperties.orientation.value === Orientation.HORIZONTAL
      ? "horizontal"
      : "vertical"
  }

  throw new Error(
    "Unknown orientation type: " + parentProperties.orientation.type,
  )
}

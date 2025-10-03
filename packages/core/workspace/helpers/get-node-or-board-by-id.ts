import { ComponentId } from "../../components/constants"
import {
  Board,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
  invariant,
} from "../../index"
import { ErrorMessages } from "../constants"

/**
 * Retrieves a node or board by its ID, checking boards first then nodes.
 * @param targetId - The ID to search for (component, variant, or instance ID)
 * @param workspace - The workspace containing the nodes and boards
 * @returns The board if found in boards, otherwise the node
 * @throws Error if neither board nor node is found
 */
export function getNodeOrBoardById(
  targetId: InstanceId | VariantId | ComponentId,
  workspace: Workspace,
): Variant | Instance | Board {
  const board = workspace.boards[targetId as ComponentId]
  if (board) {
    return board
  }

  const node = workspace.byId[targetId]
  invariant(node, ErrorMessages.nodeOrBoardNotFound(targetId))
  return node
}

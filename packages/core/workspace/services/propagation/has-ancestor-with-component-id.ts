import { ComponentId } from "../../../components/constants"
import { Board, Instance, Variant, Workspace } from "../../types"
import { nodeTraversalService } from "../nodes/node-traversal.service"
import { typeCheckingService } from "../type-checking/type-checking.service"
import { propagationNodeComponentId } from "./propagate-node-operation"

/** True when the node, or any of its ancestors, maps to the given component id. */
export function hasAncestorWithComponentId(
  componentId: ComponentId,
  node: Variant | Instance | Board,
  workspace: Workspace,
): boolean {
  if (typeCheckingService.isBoard(node)) {
    return node.type === "component" && node.catalogId === componentId
  }

  let parentNode: Variant | Instance | null = node
  while (parentNode) {
    if (propagationNodeComponentId(parentNode) === componentId) return true
    parentNode = nodeTraversalService.findParentNode(parentNode.id, workspace)
  }

  return false
}

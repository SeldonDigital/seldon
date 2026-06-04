import { isComponentId } from "../../../components/constants"
import { EntryNode, Workspace } from "../../types"
import { getNodeCatalogId } from "./get-node-catalog-id"

/**
 * Check whether a node can have children.
 *
 * @param node Node to check.
 * @param workspace Workspace that contains the node chain.
 * @returns True when the node maps to a component catalog id.
 */
export function canNodeHaveChildren(
  node: EntryNode | null,
  workspace: Workspace,
): node is EntryNode {
  if (!node) return false

  const catalogId = getNodeCatalogId(node, workspace)
  return !!catalogId && isComponentId(catalogId)
}

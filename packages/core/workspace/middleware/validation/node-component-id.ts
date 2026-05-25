import { isComponentId } from "../../../components/constants"
import type { ComponentId } from "../../../components/constants"
import { invariant } from "../../../index"
import { getNodeCatalogId } from "../../helpers/nodes/get-node-catalog-id"
import type { EntryNode, Workspace } from "../../types"

/** Resolves the catalog component id for a v0 {@link EntryNode}. */
export function getNodeComponentId(
  node: EntryNode,
  workspace: Workspace,
): ComponentId {
  const catalogId = getNodeCatalogId(node, workspace)
  invariant(
    catalogId && isComponentId(catalogId),
    `Invalid template for node ${node.id}: ${node.template}`,
  )
  return catalogId
}

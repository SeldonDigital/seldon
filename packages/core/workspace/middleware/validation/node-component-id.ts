import { isComponentId } from "../../../components/constants"
import { invariant } from "../../../helpers/utils/invariant"
import { getNodeCatalogId } from "../../helpers/nodes/get-node-catalog-id"

import type { ComponentId } from "../../../components/constants"
import type { EntryNode, Workspace } from "../../types"

/** Resolves the catalog component id for an {@link EntryNode}. */
export function getNodeComponentId(node: EntryNode, workspace: Workspace): ComponentId {
  const catalogId = getNodeCatalogId(node, workspace)

  invariant(
    catalogId && isComponentId(catalogId),
    `Invalid template for node ${node.id}: ${node.template}`,
  )

  return catalogId
}

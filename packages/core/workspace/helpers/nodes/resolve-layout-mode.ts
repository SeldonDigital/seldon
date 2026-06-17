import { getComponentSchema } from "../../../components/catalog"
import { ComponentLayout, isComponentId } from "../../../components/constants"
import type { LayoutMode } from "../../../properties/compute"
import type { EntryNode, Workspace } from "../../types"
import { getNodeCatalogId } from "./get-node-catalog-id"

/**
 * Resolves the layout model a node arranges its children with by reading the
 * `layout` meta on its catalog schema. Schemas without the meta arrange children
 * with flexbox, so anything that is not `ComponentLayout.GRID` resolves to
 * `"flexbox"`.
 */
export function resolveLayoutMode(
  node: EntryNode,
  workspace: Workspace,
): LayoutMode {
  const catalogId = getNodeCatalogId(node, workspace)
  if (!catalogId || !isComponentId(catalogId)) return "flexbox"
  return getComponentSchema(catalogId).layout === ComponentLayout.GRID
    ? "grid"
    : "flexbox"
}

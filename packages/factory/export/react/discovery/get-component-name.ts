import { Workspace } from "@seldon/core"
import type { EntryNode } from "@seldon/core/workspace/types"
import { getVariantById } from "@seldon/core/workspace/helpers/general/get-variant-by-id"
import { isDefaultVariant } from "@seldon/core/workspace/helpers/general/is-default-variant"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { isVariantNode } from "@seldon/core/workspace/helpers/nodes/is-variant-node"
import { getTemplateSourceNodeId } from "../../../helpers/workspace-nodes"
import { pascalCase } from "../utils/case-utils"

export function getComponentName(node: EntryNode, workspace: Workspace) {
  if (isVariantNode(node)) {
    const catalogId = getNodeCatalogId(node, workspace) ?? node.id
    if (isDefaultVariant(node)) {
      return pascalCase(catalogId)
    }
    return `${pascalCase(catalogId)}${pascalCase(node.label)}`
  }

  const sourceId = getTemplateSourceNodeId(node)
  if (!sourceId) {
    const catalogId = getNodeCatalogId(node, workspace) ?? node.id
    return pascalCase(catalogId)
  }

  const variant = getVariantById(sourceId, workspace)
  const catalogId = getNodeCatalogId(variant, workspace) ?? variant.id
  if (isDefaultVariant(variant)) {
    return pascalCase(catalogId)
  }
  return `${pascalCase(catalogId)}${pascalCase(variant.label)}`
}

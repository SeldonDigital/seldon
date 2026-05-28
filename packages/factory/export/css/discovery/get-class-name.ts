import { Workspace } from "@seldon/core"
import type { EntryNode } from "@seldon/core/workspace/types"
import { getVariantById } from "@seldon/core/workspace/helpers/general/get-variant-by-id"
import { isDefaultVariant } from "@seldon/core/workspace/helpers/general/is-default-variant"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { isEntryNodeInstance } from "@seldon/core/workspace/model/entry-node"
import {
  typeCheckingService,
} from "@seldon/core/workspace/services"
import {
  getInstanceClassHash,
  getTemplateSourceNodeId,
} from "../../../helpers/workspace-nodes"
import { kebabCase } from "../../react/utils/case-utils"

/**
 * Generate a class name based on the node
 *
 * Convention:
 * - Default variant: `.sdn-button` (component name only)
 * - Custom variant: `.sdn-button-iconic` (component + label, no hash)
 * - Instance: `.sdn-button-iconic--abc12` (variant class + -- + simplified 4-char hash)
 */
export const getClassNameForNode = (
  node: EntryNode,
  workspace: Workspace,
): string => {
  const catalogId = getNodeCatalogId(node, workspace)
  const componentName = kebabCase(catalogId ?? "unknown")

  if (typeCheckingService.isVariant(node)) {
    if (isDefaultVariant(node)) {
      return `sdn-${componentName}`
    }
    const variantLabel = kebabCase(node.label)
    return `sdn-${componentName}-${variantLabel}`
  }

  if (isEntryNodeInstance(node)) {
    const sourceId = getTemplateSourceNodeId(node)
    if (sourceId) {
      const sourceVariant = getVariantById(sourceId, workspace)
      const variantClassName = getClassNameForNode(sourceVariant, workspace)
      return `${variantClassName}--${getInstanceClassHash(node.id)}`
    }
  }

  return `sdn-${componentName}`
}

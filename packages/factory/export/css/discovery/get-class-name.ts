import { Workspace } from "@seldon/core"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getVariantById } from "@seldon/core/workspace/helpers/general/get-variant-by-id"
import { isDefaultVariant } from "@seldon/core/workspace/helpers/general/is-default-variant"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { isAuthoredBoard } from "@seldon/core/workspace/model/components"
import { isEntryNodeInstance } from "@seldon/core/workspace/model/entry-node"
import { typeCheckingService } from "@seldon/core/workspace/services"
import type { EntryNode } from "@seldon/core/workspace/types"

import {
  getInstanceClassHash,
  resolveSourceVariantId,
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
  // An authored component is first-class: its root and top-level variants own a
  // family named after the authored component, not the Container/Frame template
  // they resolve to. Descendant instances keep their catalog family names so
  // identical nodes still share one class across every component.
  const authoredClassName = getAuthoredRootClassName(node, workspace)
  if (authoredClassName) return authoredClassName

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
    const sourceId = resolveSourceVariantId(node, workspace)
    if (sourceId) {
      const sourceVariant = getVariantById(sourceId, workspace)
      const variantClassName = getClassNameForNode(sourceVariant, workspace)
      return `${variantClassName}--${getInstanceClassHash(node.id)}`
    }
  }

  return `sdn-${componentName}`
}

/**
 * First-class family name for an authored component's root or a top-level
 * variant, derived from the authored root's singular label such as `sdn-dialog`
 * and `sdn-dialog-create-component`. Returns null for descendant instances and
 * catalog nodes, which keep their catalog family names.
 */
function getAuthoredRootClassName(
  node: EntryNode,
  workspace: Workspace,
): string | null {
  const board = getBoardByNodeId(workspace, node.id)
  if (!board || !isAuthoredBoard(board)) return null

  const rootId = board.variants[0]?.id
  const isTopLevelNode = board.variants.some(
    (variant) => variant.id === node.id,
  )
  if (!rootId || !isTopLevelNode) return null

  const root = workspace.nodes[rootId]
  const familyName = kebabCase(root?.label ?? board.label)
  if (node.id === rootId) return `sdn-${familyName}`
  return `sdn-${familyName}-${kebabCase(node.label)}`
}

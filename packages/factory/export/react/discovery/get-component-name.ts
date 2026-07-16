import { Workspace } from "@seldon/core"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getVariantById } from "@seldon/core/workspace/helpers/general/get-variant-by-id"
import { isDefaultVariant } from "@seldon/core/workspace/helpers/general/is-default-variant"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { isVariantNode } from "@seldon/core/workspace/helpers/nodes/is-variant-node"
import { isAuthoredBoard } from "@seldon/core/workspace/model/components"
import type { AuthoredComponentBoard, EntryNode } from "@seldon/core/workspace/types"

import { resolveSourceVariantId } from "../../../helpers/workspace-nodes"
import { pascalCase } from "../utils/case-utils"

/** Name for a variant that belongs to an authored board: root uses the board label alone. */
function authoredVariantName(
  node: EntryNode,
  board: AuthoredComponentBoard,
): string {
  if (node.type === "authored") {
    return pascalCase(board.label)
  }
  return `${pascalCase(board.label)}${pascalCase(node.label)}`
}

export function getComponentName(node: EntryNode, workspace: Workspace) {
  if (isVariantNode(node)) {
    const board = getBoardByNodeId(workspace, node.id)
    if (board && isAuthoredBoard(board)) {
      return authoredVariantName(node, board)
    }
    const catalogId = getNodeCatalogId(node, workspace) ?? node.id
    if (isDefaultVariant(node)) {
      return pascalCase(catalogId)
    }
    return `${pascalCase(catalogId)}${pascalCase(node.label)}`
  }

  const sourceId = resolveSourceVariantId(node, workspace)
  if (!sourceId) {
    const catalogId = getNodeCatalogId(node, workspace) ?? node.id
    return pascalCase(catalogId)
  }

  const variant = getVariantById(sourceId, workspace)
  const variantBoard = getBoardByNodeId(workspace, variant.id)
  if (variantBoard && isAuthoredBoard(variantBoard)) {
    return authoredVariantName(variant, variantBoard)
  }
  const catalogId = getNodeCatalogId(variant, workspace) ?? variant.id
  if (isDefaultVariant(variant)) {
    return pascalCase(catalogId)
  }
  return `${pascalCase(catalogId)}${pascalCase(variant.label)}`
}

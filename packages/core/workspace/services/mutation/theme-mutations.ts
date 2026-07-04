import { remapNodeThemeTokens } from "../../../helpers/theme/remap-node-theme-tokens"
import { ThemeInstanceId } from "../../../themes/types"
import { DEFAULT_THEME_ID } from "../../constants"
import { getBoardThemeRef } from "../../helpers/components/get-board-theme-ref"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import {
  BoardKey,
  Instance,
  InstanceId,
  Variant,
  VariantId,
  Workspace,
} from "../../types"
import { nodeRelationshipService } from "../nodes/node-relationship.service"
import { nodeRetrievalService } from "../nodes/node-retrieval.service"
import { nodeTraversalService } from "../nodes/node-traversal.service"
import {
  withBoardMutation,
  withNodeMutation,
} from "../shared/workspace-operation-helpers"

/** Sets a board's theme and remaps tokens for variants that inherit from it. */
export function setComponentTheme(
  boardKey: BoardKey,
  theme: ThemeInstanceId,
  workspace: Workspace,
): Workspace {
  return withBoardMutation(boardKey, workspace, (board, draft) => {
    const currentTheme = getBoardThemeRef(board) ?? DEFAULT_THEME_ID
    board.componentTheme = theme

    for (const ref of board.variants) {
      const variantId = ref.id as VariantId
      // Resource boards (theme, font collection, icon set, media) reference
      // entries outside the node map, so there is no node theme to remap.
      if (!getWorkspaceNodes(draft)[variantId]) continue

      const variant = nodeRetrievalService.getVariant(variantId, draft)
      if (variant.theme === null) {
        remapNodeThemeTokens(variant.id, currentTheme, theme, draft)
      }
    }
  })
}

/** Sets a node's theme and remaps its tokens. A null theme inherits from the parent. */
export function setNodeTheme(
  nodeId: VariantId | InstanceId,
  theme: ThemeInstanceId | null,
  workspace: Workspace,
): Workspace {
  return withNodeMutation(nodeId, workspace, (node, draft) => {
    const currentTheme = getInheritedTheme(node, draft)
    const newTheme = theme ?? getInheritedTheme(node, draft)

    remapNodeThemeTokens(node.id, currentTheme, newTheme, draft)
    node.theme = theme
  })
}

/** Resolves a node's theme, using its direct theme or the inherited one. */
export function getNodeTheme(
  node: Variant | Instance,
  workspace: Workspace,
): ThemeInstanceId {
  if (node.theme) {
    return node.theme as ThemeInstanceId
  }
  return getInheritedTheme(node, workspace)
}

/** Resolves a node's theme by walking up to its parent, then its board. */
export function getInheritedTheme(
  node: Variant | Instance,
  workspace: Workspace,
): ThemeInstanceId {
  const parent = nodeTraversalService.findParentNode(node, workspace)
  if (parent) {
    if (parent.theme) {
      return parent.theme as ThemeInstanceId
    }
    return getNodeTheme(parent, workspace)
  }

  const board = nodeRelationshipService.findBoardForNode(node, workspace)
  if (!board) {
    return DEFAULT_THEME_ID
  }
  return getBoardThemeRef(board) ?? DEFAULT_THEME_ID
}

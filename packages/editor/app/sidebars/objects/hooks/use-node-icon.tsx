import { getComponentSchema } from "@seldon/core/components/catalog"
import { IconId } from "@seldon/core/icon-sets"
import {
  isIconSetBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { Board, Instance, Variant, Workspace } from "@seldon/core/workspace/types"

/**
 * Determines the appropriate icon for a node based on its type.
 * Returns component icon for instances, variant icons for variants, and board icon for boards.
 *
 * @param node - The board, variant, or instance to get icon for
 * @returns Icon ID to display for the node
 */
export const useNodeIcon = (
  node: Variant | Instance | Board,
  workspace?: Workspace,
): IconId => {
  if (workspaceService.isBoard(node)) {
    if (isIconSetBoard(node)) {
      return "seldon-icon"
    }
    if (isThemeBoard(node)) {
      return "seldon-theme"
    }
    return "seldon-component"
  }

  if (workspaceService.isVariant(node)) {
    return workspaceService.isDefaultVariant(node)
      ? "seldon-componentDefault"
      : "seldon-componentVariant"
  }

  try {
    const catalogId =
      workspace && "template" in node
        ? getNodeCatalogComponentId(node, workspace)
        : null
    if (!catalogId) {
      return "seldon-component"
    }
    const component = getComponentSchema(catalogId)
    return component.icon
  } catch (error) {
    console.warn(
      `Skipping node ${node.id} with invalid component ID in useNodeIcon`,
    )
    return "seldon-component"
  }
}

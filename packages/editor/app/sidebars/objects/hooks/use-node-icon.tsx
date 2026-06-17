import { getComponentSchema } from "@seldon/core/components/catalog"
import { IconId } from "@seldon/core/icon-sets"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { typeCheckingService } from "@seldon/core/workspace/services"
import {
  Board,
  Instance,
  Variant,
  Workspace,
} from "@seldon/core/workspace/types"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"

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
  if (typeCheckingService.isBoard(node)) {
    if (isIconSetBoard(node)) {
      return "seldon-icon"
    }
    if (isThemeBoard(node)) {
      return "seldon-theme"
    }
    if (isFontCollectionBoard(node)) {
      return "seldon-text"
    }
    return "seldon-component"
  }

  if (typeCheckingService.isVariant(node)) {
    return typeCheckingService.isDefaultVariant(node)
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

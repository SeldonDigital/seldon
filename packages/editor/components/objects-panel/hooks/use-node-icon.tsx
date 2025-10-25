import { getComponentSchema } from "@seldon/core/components/catalog"
import { IconId } from "@seldon/core/components/icons"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { Board, Instance, Variant } from "@seldon/core/workspace/types"

export const useNodeIcon = (node: Variant | Instance | Board): IconId => {
  if (workspaceService.isBoard(node)) {
    return "seldon-component"
  }

  // If the node is a variant node, check if it's a default variant
  if (workspaceService.isVariant(node)) {
    return workspaceService.isDefaultVariant(node)
      ? "seldon-componentDefault"
      : "seldon-componentVariant"
  }

  // If the node is an instance of the icon component, use the node.properties.icon value
  // Commented out because not icons are supported by the objects sidebar.
  // if (node.component === "icon" && node.properties.icon?.value) {
  //   return node.properties.icon?.value
  // }

  try {
    const component = getComponentSchema(node.component)
    // Otherwise use the icon from the component schema
    return component.icon
  } catch (error) {
    console.warn(
      `Skipping node ${node.id} with invalid component ID in useNodeIcon`,
    )
    return "seldon-component" // Fallback icon
  }
}

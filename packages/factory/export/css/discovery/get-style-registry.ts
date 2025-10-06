import { isEqual } from "lodash"
import { Workspace } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { mergeProperties } from "@seldon/core/properties/helpers/merge-properties"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { themeService } from "@seldon/core/workspace/services/theme.service"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { buildContext } from "../../../helpers/compute-workspace"
import { getCssObjectFromProperties } from "../../../styles/css-properties/get-css-object-from-properties"
import { Classes, NodeIdToClass } from "../types"
import { getClassNameForNodeId } from "./get-class-name"
import { getComponentIdFromClassName } from "./get-component-id-from-class-name"

/**
 * Calculate the tree depth of a node
 */
const getNodeTreeDepth = (nodeId: string, workspace: Workspace): number => {
  const node = workspace.byId[nodeId]
  if (!node || workspaceService.isVariant(node)) {
    return 0
  }

  let depth = 0
  let current = node
  let parent = workspaceService.findParentNode(current, workspace)

  while (parent) {
    depth++
    if (workspaceService.isVariant(parent)) {
      break
    }
    current = parent
    parent = workspaceService.findParentNode(current, workspace)
  }

  return depth
}

/**
 * Build the style registry for the workspace.
 * Returns a map of node ids to class names (nodeIdToClass) and a map of class names to CSS objects (classes).
 *
 * @param workspace - The workspace to build the style registry for.
 */
export const buildStyleRegistry = (
  workspace: Workspace,
): {
  classes: Classes
  nodeIdToClass: NodeIdToClass
  classNameToNodeId: Record<string, string>
  nodeTreeDepths: Record<string, number>
} => {
  const classes: Classes = {}
  const nodeIdToClass: NodeIdToClass = {}
  const classNameToNodeId: Record<string, string> = {}
  const nodeTreeDepths: Record<string, number> = {}

  // First pass: process all nodes to create CSS classes
  Object.values(workspace.byId).forEach((node) => {
    let properties = node.properties
    const className = getClassNameForNodeId(node.id)

    // Calculate tree depth for this node
    nodeTreeDepths[node.id] = getNodeTreeDepth(node.id, workspace)

    // If the node is a default variant, we need to merge the properties with the schema properties
    // With this change that default variants do not hold the properties of the schema anymore, we need to add them before we can compute the css
    // We cannot compute the CSS of schema properties without a variant, because the schema properties define theme values, and we need to know which theme to apply
    // That theme selection lives on the variant.
    if (workspaceService.isDefaultVariant(node)) {
      const schema = getComponentSchema(node.component)
      properties = mergeProperties(schema.properties, properties)
    }

    // For child nodes (instances), use the fully resolved properties including inheritance
    // This ensures child nodes inherit styling from their parent instances
    const finalProperties =
      "instanceOf" in node ? getNodeProperties(node, workspace) : properties

    const css = getCssObjectFromProperties(finalProperties, {
      properties: finalProperties,
      parentContext: buildContext(node, workspace),
      theme: themeService.getNodeTheme(node.id, workspace),
    })

    if (Object.keys(css).length === 0) {
      return
    }

    // Deduplicate classes: if a class with identical CSS and componentId exists, reuse it
    const componentId = getComponentIdFromClassName(className)
    const existing = Object.entries(classes).find(
      ([existingClassName, existingCss]) => {
        const existingComponentId =
          getComponentIdFromClassName(existingClassName)
        return isEqual(existingCss, css) && existingComponentId === componentId
      },
    )

    if (existing) {
      // Reuse the existing className for this node
      nodeIdToClass[node.id] = existing[0]
      classNameToNodeId[existing[0]] = node.id
    } else {
      // Otherwise, create a new class for this node
      classes[className] = css
      nodeIdToClass[node.id] = className
      classNameToNodeId[className] = node.id
    }
  })

  // Second pass: for child nodes without CSS classes, map them to their variant's class
  Object.values(workspace.byId).forEach((node) => {
    if (
      workspaceService.isInstance(node) &&
      "variant" in node &&
      node.variant &&
      !nodeIdToClass[node.id]
    ) {
      const variantClassName = nodeIdToClass[node.variant]
      if (variantClassName) {
        nodeIdToClass[node.id] = variantClassName
        classNameToNodeId[variantClassName] = node.id
      }
    }
  })

  return { classes, nodeIdToClass, classNameToNodeId, nodeTreeDepths }
}

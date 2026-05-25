import { ComponentToExport, JSONTreeNode } from "../../../types"
import {
  getComponentIdFromComponent,
  getComponentIdFromName,
  validateComponentProps,
} from "../../validation/validate-component-props"

/**
 * Generate function signature props spread for custom components
 * Custom components have conditional props (invalid props at depth 1) that should NOT have defaults
 * Custom components DO have grandchildren props that should have defaults
 *
 * Rules:
 * - Conditional props (invalid props at depth 1): NO defaults
 * - Valid props (valid props at depth 1): HAVE defaults (= sdn.propName)
 * - Grandchildren props (depth >= 2): HAVE defaults (= sdn.propName)
 *
 * Grandchildren prop names inherit parent numbers (e.g., buttonIconic2 → buttonIconic2Icon)
 */
export function generateCustomComponentPropsSpread(
  component: ComponentToExport,
  propValuesMap: Map<string, string>,
): string {
  const props = [`className = ""`]
  const usedPropNames = new Set<string>(["className"])

  // Process root-level props from component.tree.dataBinding.props
  const rootProps = component.tree.dataBinding.props
  for (const [propKey] of Object.entries(rootProps)) {
    if (!usedPropNames.has(propKey)) {
      usedPropNames.add(propKey)
      props.push(`${propKey} = sdn.${propKey}`)
    }
  }

  // Validate component props to determine which are conditional (invalid at depth 1)
  const componentId = getComponentIdFromComponent(component)
  const validation =
    componentId && Array.isArray(component.tree.children)
      ? validateComponentProps(
          component.name,
          componentId,
          component.tree.children as JSONTreeNode[],
        )
      : {
          validProps: (Array.isArray(component.tree.children)
            ? component.tree.children
            : []) as JSONTreeNode[],
          invalidProps: [],
          componentHasFewerPropsThanSchema: false,
        }

  /**
   * Traverse tree and add props with correct default handling
   * Processes: direct children props + grandchildren props
   */
  function traverseAndAddProps(
    node: JSONTreeNode,
    validProps: JSONTreeNode[],
    depth: number = 1,
  ) {
    const finalPropName = propValuesMap.get(node.dataBinding.path)

    // Process this node's prop if it exists in propValuesMap and hasn't been added yet
    if (finalPropName && !usedPropNames.has(finalPropName)) {
      usedPropNames.add(finalPropName)

      // Check if this prop is conditional (invalid prop at depth 1)
      const isConditional = !validProps.some(
        (validNode: JSONTreeNode) =>
          validNode.dataBinding.path === node.dataBinding.path,
      )
      const isActuallyConditional = isConditional && depth === 1

      // Conditional props at depth 1: NO defaults
      // Valid props at depth 1: HAVE defaults
      // Grandchildren (depth >= 2): HAVE defaults (regardless of parent being conditional)
      if (isActuallyConditional) {
        props.push(finalPropName)
      } else {
        props.push(`${finalPropName} = sdn.${finalPropName}`)
      }
    }

    // Always process children (grandchildren) recursively, regardless of whether parent prop was found
    // This ensures grandchildren props are added even if parent prop wasn't in propValuesMap or was already used
    if (Array.isArray(node.children)) {
      const childComponentId = getComponentIdFromName(node.name)
      const childValidation = childComponentId
        ? validateComponentProps(node.name, childComponentId, node.children)
        : {
            validProps: node.children,
            invalidProps: [],
            componentHasFewerPropsThanSchema: false,
          }

      // Recursively process grandchildren (depth + 1)
      node.children.forEach((child) =>
        traverseAndAddProps(child, childValidation.validProps, depth + 1),
      )
    }
  }

  // Process all direct children (which includes their grandchildren)
  if (Array.isArray(component.tree.children)) {
    ;(component.tree.children as JSONTreeNode[]).forEach(
      (child: JSONTreeNode) =>
        traverseAndAddProps(child, validation.validProps, 1),
    )
  }

  props.push("...props")
  return `{${props.join(",")}}`
}

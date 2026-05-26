import { ComponentToExport, JSONTreeNode } from "../../../types"
import {
  validateExportedComponentProps,
  validateTreeNodeProps,
} from "../../validation/validate-component-props"

/**
 * Generate function signature props spread for inline components
 * Inline components have valid props but invalid grandchildren
 * Invalid grandchildren (conditional props) should NOT have defaults
 */
export function generateInlineComponentPropsSpread(
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

  // Validate component props to determine which are conditional
  const validation = validateExportedComponentProps(component)

  // Traverse tree and add props
  // Conditional props (invalid grandchildren at depth 2) should NOT have defaults
  // But grandchildren of conditional props (depth 3+) should be included with defaults
  function traverseAndAddProps(
    node: JSONTreeNode,
    parentValidProps: JSONTreeNode[],
    depth: number = 1,
  ) {
    const finalPropName = propValuesMap.get(node.dataBinding.path)

    // Add this prop to function signature if it exists in propValuesMap and hasn't been added yet
    if (finalPropName && !usedPropNames.has(finalPropName)) {
      usedPropNames.add(finalPropName)

      // Check if this prop is conditional from parent's perspective
      const isConditional = !parentValidProps.some(
        (validNode: JSONTreeNode) =>
          validNode.dataBinding.path === node.dataBinding.path,
      )

      // Calculate depth to determine if this is a grandchild
      const pathParts = node.dataBinding.path.split(".")
      const actualDepth = pathParts.length - 1

      // Prop is conditional if:
      // 1. It's not in parentValidProps AND it's at depth 2 (invalid grandchild)
      // Direct children (depth 1) are always valid for inline components
      // Grandchildren of conditional props (depth 3+) are included as regular props with defaults
      const isActuallyConditional = isConditional && actualDepth === 2

      // Only add default parameter assignment for non-conditional props
      if (isActuallyConditional) {
        props.push(finalPropName)
      } else {
        props.push(`${finalPropName} = sdn.${finalPropName}`)
      }
    }

    // Always process children recursively, even if prop name already used or not found
    // This ensures grandchildren props are added even if parent prop wasn't in propValuesMap
    if (Array.isArray(node.children)) {
      const childValidation = validateTreeNodeProps(node)

      // Process children recursively
      node.children.forEach((child) =>
        traverseAndAddProps(child, childValidation.validProps, depth + 1),
      )
    }
  }

  if (Array.isArray(component.tree.children)) {
    ;(component.tree.children as JSONTreeNode[]).forEach(
      (child: JSONTreeNode) =>
        traverseAndAddProps(child, validation.validProps, 1),
    )
  }

  props.push("...props")
  return `{${props.join(",")}}`
}

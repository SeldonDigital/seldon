import { CSSProperties } from "react"
import { ComponentToExport, DataBinding, JSONTreeNode } from "../../../types"
import {
  validateExportedComponentProps,
  validateTreeNodeProps,
} from "../../validation/validate-component-props"

/**
 * Generate default props for custom components
 * Custom components handle conditional props differently from function signatures
 * Custom components DO include grandchildren props regardless of parent being conditional
 *
 * Rules:
 * - Conditional props (invalid props at depth 1): Included in defaults BUT only with className
 *   (variable declarations reference sdn.propName, so we need at least className for CSS)
 * - Valid props (valid props at depth 1): INCLUDED in defaults with all values
 * - Grandchildren props (depth >= 2): INCLUDED in defaults (regardless of parent being conditional)
 *
 * Grandchildren prop names inherit parent numbers (e.g., buttonIconic2 → buttonIconic2Icon)
 *
 * IMPORTANT: Variable declarations reference sdn.propName for ALL props (including conditional),
 * so conditional props must exist in default props with at least className, even though they
 * don't have defaults in the function signature. This ensures sdn.buttonIconic?.className works.
 */
export function generateCustomComponentDefaultProps(
  component: ComponentToExport,
  nodeIdToClass: Record<string, string> | undefined,
  propValuesMap: Map<string, string>,
): Record<
  string,
  Record<
    string,
    string | CSSProperties | boolean | number | object | string[] | number[]
  >
> {
  const defaultProps: Record<
    string,
    Record<
      string,
      string | CSSProperties | boolean | number | object | string[] | number[]
    >
  > = {}

  // Get validation for root component to determine conditional props
  const rootValidation = validateExportedComponentProps(component)

  function isConditionalProp(
    propPath: string,
    validProps: JSONTreeNode[],
  ): boolean {
    return !validProps.some(
      (validNode: JSONTreeNode) => validNode.dataBinding.path === propPath,
    )
  }

  /**
   * Traverse tree and add props to defaults with correct inclusion rules
   * Processes: direct children props + grandchildren props
   *
   * IMPORTANT: This logic must match generate-custom-function-signature.ts exactly:
   * - Conditional props (invalid props at depth 1): NOT included in defaults
   * - Valid props (valid props at depth 1): INCLUDED in defaults
   * - Grandchildren props (depth >= 2): INCLUDED in defaults (regardless of parent being conditional)
   */
  function traverse(
    node: JSONTreeNode,
    parentValidProps: JSONTreeNode[],
    depth: number = 1,
  ) {
    const path = propValuesMap.get(node.dataBinding.path)
    if (!path) {
      throw new Error(
        `Prop path "${node.dataBinding.path}" not found in propValuesMap for component "${component.name}"`,
      )
    }

    // Check if this prop is conditional from parent's perspective
    // This matches the logic in generate-custom-function-signature.ts line 64-66
    const isConditional = isConditionalProp(
      node.dataBinding.path,
      parentValidProps,
    )

    // Determine if this prop is actually conditional (only conditional at depth 1)
    // This matches the logic in generate-custom-function-signature.ts line 67
    const isActuallyConditional = isConditional && depth === 1

    // Include prop in default props:
    // - Valid props (not conditional): Include full props with all values
    // - Conditional props: Still include but only with className (variable declarations reference sdn.propName)
    // - Grandchildren: Always included regardless of parent being conditional
    if (!isActuallyConditional) {
      // Valid props or grandchildren: Include full props
      defaultProps[path] = flattenProps(
        node.dataBinding.props,
        node.nodeId,
        nodeIdToClass,
        node.classNames,
      )
    } else {
      // Conditional props: Include only className since variable declarations reference sdn.propName
      // This ensures sdn.buttonIconic?.className works even though buttonIconic has no function signature default
      if (node.classNames && node.classNames.length > 0) {
        defaultProps[path] = {
          className: node.classNames.filter(Boolean).join(" "),
        }
      } else if (node.nodeId && nodeIdToClass && nodeIdToClass[node.nodeId]) {
        defaultProps[path] = {
          className: nodeIdToClass[node.nodeId],
        }
      }
    }

    // Process children (grandchildren)
    if (Array.isArray(node.children)) {
      // Determine validation for this node's children
      const childValidation = validateTreeNodeProps(node)

      // Recursively process grandchildren (depth + 1)
      // Grandchildren are always included in defaults regardless of parent being conditional
      node.children.forEach((child) => {
        traverse(child, childValidation.validProps, depth + 1)
      })
    }
  }

  // Process root component props
  if (Object.keys(component.tree.dataBinding.props).length > 0) {
    Object.assign(
      defaultProps,
      flattenProps(
        component.tree.dataBinding.props,
        component.tree.nodeId,
        nodeIdToClass,
        component.tree.classNames,
      ),
    )
  }

  // Process child components - exclude conditional props at depth 1, include grandchildren
  if (Array.isArray(component.tree.children)) {
    ;(component.tree.children as JSONTreeNode[]).forEach(
      (child: JSONTreeNode) => {
        traverse(child, rootValidation.validProps, 1)
      },
    )
  }

  return defaultProps
}

function flattenProps(
  props: DataBinding["props"],
  nodeId?: string,
  nodeIdToClass?: Record<string, string>,
  classNames?: string[],
) {
  const flattened: Record<
    string,
    string | CSSProperties | boolean | number | object | string[] | number[]
  > = {}

  for (const [key, propValue] of Object.entries(props)) {
    const value =
      propValue.value !== undefined ? propValue.value : propValue.defaultValue
    flattened[key] = value
  }

  // Add className: prefer classNames array from tree (includes both variant and instance classes)
  // This ensures that all props in default props have className values for proper CSS styling
  if (classNames && classNames.length > 0) {
    flattened.className = classNames.filter(Boolean).join(" ")
  } else if (nodeId && nodeIdToClass && nodeIdToClass[nodeId]) {
    // Fallback to nodeIdToClass if classNames array is not available
    flattened.className = nodeIdToClass[nodeId]
  }

  return flattened
}

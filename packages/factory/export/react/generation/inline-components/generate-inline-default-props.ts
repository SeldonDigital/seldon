import { CSSProperties } from "react"
import { ComponentToExport, DataBinding, JSONTreeNode } from "../../../types"
import {
  getComponentIdFromComponent,
  getComponentIdFromName,
  validateComponentProps,
} from "../../validation/validate-component-props"

/**
 * Generate default props for inline components
 * Inline components have valid props but invalid grandchildren
 * Exclude conditional props (invalid grandchildren at depth 2) from defaults
 * But include valid grandchildren
 */
export function generateInlineComponentDefaultProps(
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

  // Get validation for root component
  const componentId = getComponentIdFromComponent(component)
  const rootValidation =
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

  function isConditionalProp(
    propPath: string,
    validProps: JSONTreeNode[],
  ): boolean {
    return !validProps.some(
      (validNode: JSONTreeNode) => validNode.dataBinding.path === propPath,
    )
  }

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

    // Calculate depth to determine if this is a grandchild
    const pathParts = node.dataBinding.path.split(".")
    const actualDepth = pathParts.length - 1

    // Check if this prop is conditional from parent's perspective
    const isConditional = isConditionalProp(
      node.dataBinding.path,
      parentValidProps,
    )

    // Include prop in default props if:
    // 1. It's not conditional (valid prop) - include all valid props regardless of depth
    // 2. OR it's at depth > 2 (grandchildren of conditional props) - include these
    // Exclude only invalid grandchildren at depth 2 (conditional props like `button`, `button2`)
    const shouldInclude = !isConditional || actualDepth > 2

    if (shouldInclude) {
      defaultProps[path] = flattenProps(
        node.dataBinding.props,
        node.nodeId,
        nodeIdToClass,
        node.classNames,
      )
    }

    // Process children recursively
    if (Array.isArray(node.children)) {
      // Determine validation for this node's children
      const childComponentId = getComponentIdFromName(node.name)
      const childValidation = childComponentId
        ? validateComponentProps(node.name, childComponentId, node.children)
        : {
            validProps: node.children,
            invalidProps: [],
            componentHasFewerPropsThanSchema: false,
          }

      node.children.forEach((child) => {
        // Pass down: child's validProps and increment depth
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

  // Process child components - include valid props and valid grandchildren
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

  // Add className: prefer classNames array from tree
  if (classNames && classNames.length > 0) {
    flattened.className = classNames.filter(Boolean).join(" ")
  } else if (nodeId && nodeIdToClass && nodeIdToClass[nodeId]) {
    flattened.className = nodeIdToClass[nodeId]
  }

  return flattened
}

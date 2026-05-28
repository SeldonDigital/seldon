import { CSSProperties } from "react"
import { ComponentToExport, DataBinding, JSONTreeNode } from "../../../types"

/**
 * Generate default props for default components
 * Default components have all valid props, so all props get defaults
 */
export function generateDefaultComponentDefaultProps(
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

  // Process child components - all children are valid in default components
  // Also include grandchildren props when they are passed as props to child components
  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach((child) => {
      const path = propValuesMap.get(child.dataBinding.path)
      if (!path) {
        throw new Error(
          `Prop path "${child.dataBinding.path}" not found in propValuesMap for component "${component.name}"`,
        )
      }

      // Default components include all props (all are valid)
      defaultProps[path] = flattenProps(
        child.dataBinding.props,
        child.nodeId,
        nodeIdToClass,
        child.classNames,
      )

      // Process grandchildren props - these are passed as props to direct children
      // Grandchildren props inherit parent numbers (e.g., buttonIconic2 → buttonIconic2Icon)
      if (Array.isArray(child.children)) {
        child.children.forEach((grandchild) => {
          const grandchildPath = propValuesMap.get(grandchild.dataBinding.path)
          if (!grandchildPath) {
            throw new Error(
              `Prop path "${grandchild.dataBinding.path}" not found in propValuesMap for component "${component.name}"`,
            )
          }

          // Default components include all props (all are valid)
          defaultProps[grandchildPath] = flattenProps(
            grandchild.dataBinding.props,
            grandchild.nodeId,
            nodeIdToClass,
            grandchild.classNames,
          )
        })
      }
    })
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

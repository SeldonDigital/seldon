import { CSSProperties } from "react"

import { ComponentToExport, DataBinding, JSONTreeNode } from "../../../types"
import { getConditionalPropPaths } from "./get-conditional-prop-paths"

type DefaultPropsValue = Record<
  string,
  string | CSSProperties | boolean | number | object | string[] | number[]
>

/**
 * Generates the component's default property values (the `sdn` object).
 *
 * Non-conditional nodes contribute their full flattened props. Conditional
 * nodes only contribute a className, because variable declarations reference
 * `sdn.<prop>?.className` for every node even when the prop has no default in
 * the function signature.
 */
export function generateDefaultProps(
  component: ComponentToExport,
  nodeIdToClass: Record<string, string> | undefined,
  propNames: Map<string, string>,
): Record<string, DefaultPropsValue> {
  const defaultProps: Record<string, DefaultPropsValue> = {}
  const conditionalPaths = getConditionalPropPaths(component)

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

  function traverse(node: JSONTreeNode) {
    const propName = propNames.get(node.dataBinding.path)
    if (!propName) {
      throw new Error(
        `Prop path "${node.dataBinding.path}" not found in prop names for component "${component.name}"`,
      )
    }

    if (conditionalPaths.has(node.dataBinding.path)) {
      const className = getClassName(node, nodeIdToClass)
      if (className) {
        defaultProps[propName] = { className }
      }
    } else {
      defaultProps[propName] = flattenProps(
        node.dataBinding.props,
        node.nodeId,
        nodeIdToClass,
        node.classNames,
      )
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }

  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach(traverse)
  }

  return defaultProps
}

function getClassName(
  node: JSONTreeNode,
  nodeIdToClass: Record<string, string> | undefined,
): string | undefined {
  if (node.classNames && node.classNames.length > 0) {
    return node.classNames.filter(Boolean).join(" ")
  }
  if (node.nodeId && nodeIdToClass && nodeIdToClass[node.nodeId]) {
    return nodeIdToClass[node.nodeId]
  }
  return undefined
}

function flattenProps(
  props: DataBinding["props"],
  nodeId?: string,
  nodeIdToClass?: Record<string, string>,
  classNames?: string[],
): DefaultPropsValue {
  const flattened: DefaultPropsValue = {}

  for (const [key, propValue] of Object.entries(props)) {
    const value =
      propValue.value !== undefined ? propValue.value : propValue.defaultValue
    flattened[key] = value
  }

  if (classNames && classNames.length > 0) {
    flattened.className = classNames.filter(Boolean).join(" ")
  } else if (nodeId && nodeIdToClass && nodeIdToClass[nodeId]) {
    flattened.className = nodeIdToClass[nodeId]
  }

  return flattened
}

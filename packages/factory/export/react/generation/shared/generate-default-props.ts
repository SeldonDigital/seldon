import { getConditionalPropPaths } from "./get-conditional-prop-paths"

import type { ComponentToExport, DataBinding, JSONTreeNode } from "../../../types"
import type { CSSProperties } from "react"

type DefaultPropsValue = Record<
  string,
  string | CSSProperties | boolean | number | object | string[] | number[]
>

/**
 * Generates the component's default property values (the `sdn` object).
 *
 * Non-conditional nodes contribute their full flattened props. Conditional
 * nodes on a catalog component contribute only a className and a ref, so their
 * inline extras stay consumer-supplied while the merge helpers still find the
 * class and the ref name.
 *
 * The root entry drops its `className`: the root class is inlined at the render
 * site from the variant class names, so nothing reads it here.
 */
export function generateDefaultProps(
  component: ComponentToExport,
  nodeIdToClass: Record<string, string> | undefined,
  propNames: Map<string, string>,
): Record<string, DefaultPropsValue> {
  const defaultProps: Record<string, DefaultPropsValue> = {}
  const conditionalPaths = getConditionalPropPaths(component)

  if (Object.keys(component.tree.dataBinding.props).length > 0) {
    const rootEntry = flattenProps(
      component.tree.dataBinding.props,
      component.tree.nodeId,
      nodeIdToClass,
      component.tree.classNames,
    )

    // The root element takes its class from the variant class names inlined at
    // the render site, so a root `className` entry here is never read.
    delete rootEntry.className

    Object.assign(defaultProps, rootEntry)
  }

  function traverse(node: JSONTreeNode) {
    const propName = propNames.get(node.dataBinding.path)

    if (!propName) {
      throw new Error(
        `Prop path "${node.dataBinding.path}" not found in prop names for component "${component.name}"`,
      )
    }

    if (conditionalPaths.has(node.dataBinding.path)) {
      // Authored components bake their conditional leaves' content (text, icon,
      // placeholder) as default props so the generated component renders its
      // authored copy without a controller. The props stay overridable through
      // the `{...sdn.x, ...x}` merge. Catalog components keep className-only
      // conditional defaults so their inline extras remain consumer-supplied.
      if (component.authored) {
        const entry = flattenProps(
          node.dataBinding.props,
          node.nodeId,
          nodeIdToClass,
          node.classNames,
        )

        if (node.ref) {
          entry["data-seldon-ref"] = node.ref
        }

        defaultProps[propName] = entry
      } else {
        const className = getClassName(node, nodeIdToClass)
        const entry: DefaultPropsValue = {}

        if (className) {
          entry.className = className
        }

        // A child instance has no literal JSX attribute site; its ref rides the
        // sdn default props through the `{...props}` spread onto the child root.
        if (node.ref) {
          entry["data-seldon-ref"] = node.ref
        }

        if (Object.keys(entry).length > 0) {
          defaultProps[propName] = entry
        }
      }
    } else {
      const entry = flattenProps(
        node.dataBinding.props,
        node.nodeId,
        nodeIdToClass,
        node.classNames,
      )

      if (node.ref) {
        entry["data-seldon-ref"] = node.ref
      }

      defaultProps[propName] = entry
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
    const value = propValue.value !== undefined ? propValue.value : propValue.defaultValue

    flattened[key] = value
  }

  if (classNames && classNames.length > 0) {
    flattened.className = classNames.filter(Boolean).join(" ")
  } else if (nodeId && nodeIdToClass && nodeIdToClass[nodeId]) {
    flattened.className = nodeIdToClass[nodeId]
  }

  return flattened
}

import { getConditionalPropPaths } from "./get-conditional-prop-paths"

import type { ComponentToExport, DataBinding, JSONTreeNode } from "../../../types"
import type { CSSProperties } from "react"

type DefaultPropsValue = Record<
  string,
  string | CSSProperties | boolean | number | object | string[] | number[]
>

/** The authored copy every slot keeps: its text, its icon, and its placeholder. */
const COPY_PROPS = ["children", "icon", "placeholder"]

/**
 * Generates the component's default property values (the `sdn` object).
 *
 * A non-conditional node contributes its full flattened props, and so does a
 * conditional node on an authored component, which renders its authored tree
 * without a controller.
 *
 * A conditional node elsewhere contributes its copy, its class, and its ref. The
 * copy comes from the design, while the markup and state a conditional slot
 * renders with stay consumer-supplied.
 *
 * Every entry is overridable: the merge helpers layer caller props and
 * `seldonRefs` over these defaults.
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

    const keepEveryProp = component.authored || !conditionalPaths.has(node.dataBinding.path)
    const entry = keepEveryProp
      ? flattenProps(node.dataBinding.props, node.nodeId, nodeIdToClass, node.classNames)
      : flattenProps(pickCopy(node.dataBinding.props), node.nodeId, nodeIdToClass, node.classNames)

    // A child instance has no literal JSX attribute site; its ref rides the
    // sdn default props through the `{...props}` spread onto the child root.
    if (node.ref) {
      entry["data-seldon-ref"] = node.ref
    }

    defaultProps[propName] = entry

    if (Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }

  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach(traverse)
  }

  return defaultProps
}

function pickCopy(props: DataBinding["props"]): DataBinding["props"] {
  const copy: DataBinding["props"] = {}

  for (const key of COPY_PROPS) {
    if (props[key]) {
      copy[key] = props[key]
    }
  }

  return copy
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

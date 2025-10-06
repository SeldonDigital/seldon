import { CSSProperties } from "react"
import { ComponentToExport, DataBinding, JSONTreeNode } from "../../types"
import { getHumanReadablePropName } from "../discovery/get-human-readable-prop-name"
import { TransformStrategy, transformSource } from "../utils/transform-source"
import { generatePropNamesMap } from "./generate-prop-names-map"

/**
 * We build a defaultProps object to make sure nested children have
 * the correct overrides, In the function body the are merged together
 * with the props that are passed from the parent.
 *
 * For a buttonbar this will look something like:
 *
 * const sdn = {
 *   button: {
 *     label: {
 *       children: "Label"
 *     }
 *     icon: {
 *       icon: "__default__"
 *     }
 *   }
 * }
 *
 * @param source
 * @param component
 * @param nodeIdToClass - Mapping of node IDs to CSS class names for themed components
 * @returns - Update source content
 */
export function insertDefaultProps(
  source: string,
  component: ComponentToExport,
  nodeIdToClass?: Record<string, string>,
) {
  const defaultProps: Record<
    string,
    Record<
      string,
      string | CSSProperties | boolean | number | object | string[] | number[]
    >
  > = {}

  // Use the same prop names map that's used in interface and component function
  const propNamesMap = generatePropNamesMap(component)

  function traverse(node: JSONTreeNode) {
    const path =
      propNamesMap.get(node.dataBinding.path) ||
      getHumanReadablePropName(node.dataBinding.path, {
        simplifiedPropNames: true,
        parentComponentName: component.name,
      })

    defaultProps[path] = flattenProps(
      node.dataBinding.props,
      node.nodeId,
      nodeIdToClass,
    )
    if (Array.isArray(node.children)) {
      node.children.forEach((child) => traverse(child))
    }
  }

  // Process root component props
  if (Object.keys(component.tree.dataBinding.props).length > 0) {
    const rootPath =
      propNamesMap.get(component.tree.dataBinding.path) ||
      component.name.toLowerCase()
    defaultProps[rootPath] = flattenProps(
      component.tree.dataBinding.props,
      component.tree.nodeId,
      nodeIdToClass,
    )
  }

  // Process child components
  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach((child) => traverse(child))
  }

  if (Object.keys(defaultProps).length === 0) {
    return source
  }

  source = transformSource({
    source,
    strategy: TransformStrategy.APPEND,
    content: `\nconst sdn: ${component.tree.dataBinding.interfaceName} = ${JSON.stringify(
      defaultProps,
      null,
      2,
    )}`,
  })

  return source
}

function flattenProps(
  props: DataBinding["props"],
  nodeId?: string,
  nodeIdToClass?: Record<string, string>,
) {
  const flattened: Record<
    string,
    string | CSSProperties | boolean | number | object | string[] | number[]
  > = {}

  for (const [key, propValue] of Object.entries(props)) {
    // Handle both 'value' and 'defaultValue' for backward compatibility
    const value =
      propValue.value !== undefined ? propValue.value : propValue.defaultValue
    flattened[key] = value
  }

  // Add className if there's a theme-specific class for this node
  if (nodeId && nodeIdToClass && nodeIdToClass[nodeId]) {
    flattened.className = nodeIdToClass[nodeId]
  }

  return flattened
}

import { ComponentLevel } from "@seldon/core/components/constants"
import { Workspace } from "@seldon/core/workspace/types"

import { NodeIdToClass } from "../../../css/types"
import { ComponentToExport, JSONTreeNode } from "../../../types"
import {
  validateExportedComponentProps,
  validateTreeNodeProps,
} from "../../validation/validate-component-props"
import { assignPropNames } from "../shared/assign-prop-names"
import { JSXNode, JSXNodeType, JSXStructure } from "./types"

/**
 * Generates the JSX structure for a component along with its prop name map.
 *
 * Prop names are assigned once via {@link assignPropNames} and carried directly
 * on each JSX node. Grandchildren that are passed as props resolve their target
 * slot name from the child component's own numbering, so no name is re-derived
 * from generated strings or looked up through stored component metadata.
 *
 * @param component - Component to generate JSX structure for
 * @param nodeIdToClass - Mapping of node IDs to CSS class names
 * @param workspace - Workspace for variant type detection
 * @returns JSX structure with the root node and the path-to-prop-name map
 */
export function generateJSXStructure(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  workspace: Workspace,
): JSXStructure {
  const { tree, config } = component

  const treeChildren = Array.isArray(tree.children) ? tree.children : []

  // Single source of prop names for this component, keyed by node id.
  const nodeIdToPropName = assignPropNames(treeChildren)

  // Path-keyed view consumed by interface, signature, and default-prop generators.
  const propNames = new Map<string, string>()
  function collectPropNames(node: JSONTreeNode) {
    const propName = nodeIdToPropName.get(node.nodeId)
    if (propName) {
      propNames.set(node.dataBinding.path, propName)
    }
    if (Array.isArray(node.children)) {
      node.children.forEach(collectPropNames)
    }
  }
  treeChildren.forEach(collectPropNames)

  // Validate component props
  const validation = validateExportedComponentProps(component)

  // Build JSX structure recursively
  function buildJSXNode(node: JSONTreeNode): JSXNode {
    const propName = nodeIdToPropName.get(node.nodeId)
    if (!propName) {
      throw new Error(
        `Prop name not found for node "${node.name}" at path "${node.dataBinding.path}" in component "${component.name}". ` +
          `This indicates a bug in prop name assignment.`,
      )
    }

    const propVarName = `${propName}Props`
    const propKeyName = propName

    // Determine node type
    let nodeType: JSXNodeType = "component"
    let condition: string | undefined

    const isValidProp = Array.isArray(validation.validProps)
      ? validation.validProps.some(
          (validNode) => validNode.dataBinding.path === node.dataBinding.path,
        )
      : false

    if (node.level === ComponentLevel.FRAME) {
      nodeType = "frame"
      // Frame should be conditionally rendered if it's an invalid prop
      if (!isValidProp) {
        condition = propName
      }
    } else if (!isValidProp) {
      nodeType = "conditional"
      condition = propName
    }

    // Handle children
    const children: JSXNode[] = []
    const grandchildProps: Array<{ propKeyName: string; propVarName: string }> =
      []

    if (Array.isArray(node.children)) {
      // Check if this node has grandchildren that should be passed as props
      const childValidation = validateTreeNodeProps(node)

      const hasValidGrandchildren =
        childValidation.invalidProps.length === 0 && node.children.length > 0

      if (hasValidGrandchildren && node.level !== ComponentLevel.FRAME) {
        // Grandchildren are passed as props to this child component. The JSX
        // attribute name is the child component's own slot name for each
        // grandchild, derived from the child's own numbering.
        const childSlotNames = assignPropNames(node.children)

        node.children.forEach((grandchild) => {
          const grandchildPropValue = nodeIdToPropName.get(grandchild.nodeId)
          const slotName = childSlotNames.get(grandchild.nodeId)
          if (!grandchildPropValue || !slotName) {
            throw new Error(
              `Prop name not found for grandchild "${grandchild.name}" at path "${grandchild.dataBinding.path}" in component "${component.name}". ` +
                `This indicates a bug in prop name assignment.`,
            )
          }

          grandchildProps.push({
            propKeyName: slotName,
            propVarName: `${grandchildPropValue}Props`,
          })
        })
      } else {
        // Children should be rendered as JSX children
        node.children.forEach((child) => {
          children.push(buildJSXNode(child))
        })
      }
    }

    return {
      type: nodeType,
      name: node.name,
      path: node.dataBinding.path,
      propVarName,
      propKeyName,
      children: children.length > 0 ? children : undefined,
      condition,
      grandchildProps: grandchildProps.length > 0 ? grandchildProps : undefined,
    }
  }

  // Build root node (wrapper for the component)
  const rootChildren: JSXNode[] = treeChildren.map((child) =>
    buildJSXNode(child),
  )

  const root: JSXNode = {
    type: "component",
    name: config.react.returns || "div",
    path: tree.dataBinding.path,
    propVarName: "props",
    children: rootChildren.length > 0 ? rootChildren : undefined,
  }

  return { root, propNames }
}

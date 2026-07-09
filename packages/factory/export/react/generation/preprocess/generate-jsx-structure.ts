import { ComponentLevel } from "@seldon/core/components/constants"
import { Workspace } from "@seldon/core/workspace/types"

import { NodeIdToClass } from "../../../css/types"
import { ComponentToExport, JSONTreeNode } from "../../../types"
import {
  validateExportedComponentProps,
  validateTreeNodeProps,
} from "../../validation/validate-component-props"
import { assignPropNames } from "../shared/assign-prop-names"
import { getConditionalPropPaths } from "../shared/get-conditional-prop-paths"
import { JSXNode, JSXNodeType, JSXStructure } from "./types"

/**
 * Reports whether a node's descendant tree can be flattened into props without
 * loss. Forwarding stops at a `FRAME` boundary, so a child that holds its own
 * children behind a frame would silently drop them. When that happens the node
 * renders its children as nested JSX instead, matching how instance trees nest
 * their overrides. This is the wiring signal, kept independent from the schema
 * validation that drives default-vs-conditional classification.
 */
function canForwardLosslessly(node: JSONTreeNode): boolean {
  const children = Array.isArray(node.children) ? node.children : []
  return children.every((child) => {
    const grandchildren = Array.isArray(child.children) ? child.children : []
    if (grandchildren.length === 0) return true
    if (child.level === ComponentLevel.FRAME) return false
    return canForwardLosslessly(child)
  })
}

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
  _nodeIdToClass: NodeIdToClass,
  _workspace: Workspace,
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

  // Classification signal: which nodes are inline extras (conditional) rather
  // than canonical schema children. A forwarded conditional leaf is guarded by
  // its source prop so it only renders when the caller supplies it.
  const conditionalPaths = getConditionalPropPaths(component)

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
      // Frame should be conditionally rendered if it's an invalid prop or a
      // placeholder slot.
      if (!isValidProp || node.isPlaceholder) {
        condition = propName
      }
    } else if (!isValidProp || node.isPlaceholder) {
      // Inline extras and placeholder slots render only when the caller passes
      // the prop. The merged props variable is checked as well so TypeScript
      // narrows it to non-null.
      nodeType = "conditional"
      condition = `${propName} && ${propVarName}`
    } else {
      // Canonical children render their sdn default when the prop is omitted
      // and are suppressed when the caller passes null. Guarding the merged
      // props variable narrows it for the spread below.
      nodeType = "conditional"
      condition = `${propVarName} !== null`
    }

    // Handle children
    const children: JSXNode[] = []
    const grandchildProps: Array<{
      propKeyName: string
      propVarName: string
      guard?: string
    }> = []

    if (Array.isArray(node.children)) {
      // Check if this node has grandchildren that should be passed as props
      const childValidation = validateTreeNodeProps(node)

      const hasValidGrandchildren =
        childValidation.invalidProps.length === 0 &&
        node.children.length > 0 &&
        canForwardLosslessly(node)

      if (hasValidGrandchildren && node.level !== ComponentLevel.FRAME) {
        // Grandchildren are passed as props to this child component. The JSX
        // attribute name is the child component's own slot name for each
        // grandchild, derived from the child's own numbering.
        const childSlotNames = assignPropNames(node.children)

        // Forward every hoisted descendant whose ancestor chain (up to this
        // node) is itself flattened into props, not only direct children. This
        // reaches leaves nested inside an intermediate child component, such as
        // the icon of a button that lives inside a combobox field. Each
        // intermediate child component pairs the forwarded leaf onto its own
        // slot, so the slot name comes from this node's numbering, which matches
        // the intermediate component's own numbering.
        const forwardDescendants = (descendants: JSONTreeNode[]) => {
          descendants.forEach((descendant) => {
            const grandchildPropValue = nodeIdToPropName.get(descendant.nodeId)
            const slotName = childSlotNames.get(descendant.nodeId)
            if (!grandchildPropValue || !slotName) {
              throw new Error(
                `Prop name not found for grandchild "${descendant.name}" at path "${descendant.dataBinding.path}" in component "${component.name}". ` +
                  `This indicates a bug in prop name assignment.`,
              )
            }

            const isConditional =
              conditionalPaths.has(descendant.dataBinding.path) ||
              Boolean(descendant.isPlaceholder)
            grandchildProps.push({
              propKeyName: slotName,
              propVarName: `${grandchildPropValue}Props`,
              // Guard conditional and placeholder leaves with their source prop
              // so an omitted caller value keeps the leaf absent, preserving
              // baseline layout.
              guard: isConditional ? grandchildPropValue : undefined,
            })

            // Recurse on the wiring signal only: a real child component with its
            // own children threads them onto its slots regardless of whether the
            // child matches an exact schema variant. The lossless check above
            // guarantees no frame boundary drops a descendant.
            if (
              Array.isArray(descendant.children) &&
              descendant.children.length > 0 &&
              descendant.level !== ComponentLevel.FRAME
            ) {
              forwardDescendants(descendant.children)
            }
          })
        }

        forwardDescendants(node.children)
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
      ref: node.ref,
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
    ref: tree.ref,
    children: rootChildren.length > 0 ? rootChildren : undefined,
  }

  return { root, propNames }
}

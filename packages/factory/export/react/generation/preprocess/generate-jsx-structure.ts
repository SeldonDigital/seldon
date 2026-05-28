import { ComponentLevel } from "@seldon/core/components/constants"
import { Workspace } from "@seldon/core/workspace/types"
import { NodeIdToClass } from "../../../css/types"
import { ComponentToExport, JSONTreeNode } from "../../../types"
import { camelCase } from "../../utils/case-utils"
import {
  validateExportedComponentProps,
  validateTreeNodeProps,
} from "../../validation/validate-component-props"
import { ComponentMetadataStorage } from "../component-metadata"
import { isCustomComponent } from "../custom-components/is-custom-component"
import { isInlineComponent } from "../inline-components/is-inline-component"
import { JSXNode, JSXNodeType } from "./types"

/**
 * Generates JSX structure with correct sequential prop names.
 *
 * This function creates a structured JSX representation where:
 * - All components (direct children + Frame children + grandchildren) are numbered sequentially
 * - Sequential numbering is global across the entire tree
 * - Prop names are correct from the start (no post-processing needed)
 *
 * @param component - Component to generate JSX structure for
 * @param nodeIdToClass - Mapping of node IDs to CSS class names
 * @param componentMetadataStorage - Storage for component metadata lookup
 * @param workspace - Workspace for variant type detection
 * @returns JSX structure with correct prop names
 */
export function generateJSXStructure(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  componentMetadataStorage: ComponentMetadataStorage,
  workspace: Workspace,
): JSXNode {
  const { tree, config } = component

  // Collect ALL nodes in the tree (direct children + Frame children + grandchildren)
  // We'll assign sequential numbers globally based on component base name
  const allNodes: JSONTreeNode[] = []

  function collectAllNodes(node: JSONTreeNode) {
    allNodes.push(node)
    if (Array.isArray(node.children)) {
      node.children.forEach((child) => collectAllNodes(child))
    }
  }

  if (Array.isArray(tree.children)) {
    tree.children.forEach((child) => collectAllNodes(child))
  }

  // Assign sequential numbers globally based on component base name
  const baseNameCounts = new Map<string, number>()
  const nodeToPropName = new Map<JSONTreeNode, string>()

  allNodes.forEach((node) => {
    const baseName = camelCase(node.name).replace(/\d+$/, "")
    const currentCount = baseNameCounts.get(baseName) || 0
    const newCount = currentCount + 1
    baseNameCounts.set(baseName, newCount)

    const propName = newCount === 1 ? baseName : `${baseName}${newCount}`
    nodeToPropName.set(node, propName)
  })

  // Validate component props
  const validation = validateExportedComponentProps(component)

  const rootIsInline = isInlineComponent(component)
  const rootIsCustom = isCustomComponent(component, workspace)

  // Build JSX structure recursively
  function buildJSXNode(node: JSONTreeNode): JSXNode {
    const propName = nodeToPropName.get(node)
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

    // Check if this is a Frame
    if (node.level === ComponentLevel.FRAME) {
      nodeType = "frame"
      // Frame should be conditionally rendered if it's an invalid prop
      const isValidProp = Array.isArray(validation.validProps)
        ? validation.validProps.some(
            (validNode) => validNode.dataBinding.path === node.dataBinding.path,
          )
        : false
      if (!isValidProp) {
        condition = propName
      }
    } else {
      // Check if this should be conditionally rendered
      const isValidProp = Array.isArray(validation.validProps)
        ? validation.validProps.some(
            (validNode) => validNode.dataBinding.path === node.dataBinding.path,
          )
        : false

      if (!isValidProp) {
        nodeType = "conditional"
        condition = propName
      }
    }

    // Handle children
    const children: JSXNode[] = []
    const grandchildProps: Array<{ propKey: string; propVarName: string }> = []

    if (Array.isArray(node.children)) {
      // Check if this node has grandchildren that should be passed as props
      const childValidation = validateTreeNodeProps(node)

      const hasValidGrandchildren =
        childValidation.invalidProps.length === 0 && node.children.length > 0

      if (hasValidGrandchildren && node.level !== ComponentLevel.FRAME) {
        // Grandchildren should be passed as props (not rendered as children)
        // This works for default, custom, AND inline components
        // when grandchildren are valid props of the child component
        node.children.forEach((grandchild) => {
          const grandchildPropValue = nodeToPropName.get(grandchild)
          if (!grandchildPropValue) {
            throw new Error(
              `Prop name not found for grandchild "${grandchild.name}" at path "${grandchild.dataBinding.path}" in component "${component.name}". ` +
                `This indicates a bug in prop name assignment.`,
            )
          }
          const grandchildPropVarName = `${grandchildPropValue}Props`

          // Store grandchild path for later prop key lookup
          grandchildProps.push({
            propKey: grandchild.dataBinding.path,
            propVarName: grandchildPropVarName,
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
  const rootChildren: JSXNode[] = []

  if (Array.isArray(tree.children) && tree.children.length > 0) {
    tree.children.forEach((child) => {
      rootChildren.push(buildJSXNode(child))
    })
  }

  return {
    type: "component",
    name: config.react.returns || "div",
    path: tree.dataBinding.path,
    propVarName: "props",
    children: rootChildren.length > 0 ? rootChildren : undefined,
  }
}

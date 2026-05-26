import { ComponentToExport, JSONTreeNode } from "../../../types"
import {
  validateExportedComponentProps,
  validateTreeNodeProps,
} from "../../validation/validate-component-props"

/**
 * Determine if a prop will be conditionally rendered based on the validation results
 */
function isConditionalProp(
  propPath: string,
  validProps: JSONTreeNode[],
  allProps: JSONTreeNode[],
): boolean {
  // A prop is conditional if it's not in the validProps list
  // This matches the logic in react-jsx-tree-builder.ts
  return !validProps.some(
    (validNode: JSONTreeNode) => validNode.dataBinding.path === propPath,
  )
}

/**
 * Collect all prop paths from the tree recursively
 */
function collectAllPropPaths(nodes: JSONTreeNode[]): string[] {
  const paths: string[] = []

  function traverse(node: JSONTreeNode) {
    paths.push(node.dataBinding.path)
    if (Array.isArray(node.children)) {
      node.children.forEach((child) => traverse(child))
    }
  }

  nodes.forEach((node) => traverse(node))
  return paths
}

/**
 * Generate the props spread for a component function signature
 */
export function generatePropsSpread(
  component: ComponentToExport,
  propNamesMap: Map<string, string>,
): string {
  const props = [`className = ""`]
  const usedPropNames = new Set<string>(["className"])

  // Process root-level props from component.tree.dataBinding.props
  // These are props directly on the component (not children)
  const rootProps = component.tree.dataBinding.props
  for (const [propKey, propValue] of Object.entries(rootProps)) {
    if (!usedPropNames.has(propKey)) {
      usedPropNames.add(propKey)
      // Use sdn reference for root-level props that have defaults
      // The sdn object is created by insertDefaultProps when props exist
      props.push(`${propKey} = sdn.${propKey}`)
    }
  }

  function traverseTreeAndAddProps(
    node: JSONTreeNode,
    validProps: JSONTreeNode[],
    parentIsConditional: boolean = false,
  ) {
    const finalPropName = propNamesMap.get(node.dataBinding.path)
    if (finalPropName && !usedPropNames.has(finalPropName)) {
      usedPropNames.add(finalPropName)

      // Check if this specific prop is conditional
      const isConditional = isConditionalProp(
        node.dataBinding.path,
        validProps,
        [],
      )

      // Calculate depth to determine if this is a grandchild
      const pathParts = node.dataBinding.path.split(".")
      const depth = pathParts.length - 1

      // Prop is conditional if:
      // 1. It's not in validProps (invalid prop) AND it's at depth 1 (direct child)
      // Grandchildren (depth >= 2) are never conditional, even if parent is conditional
      const isActuallyConditional = isConditional && depth === 1

      // Only add default parameter assignment for non-conditional props
      if (isActuallyConditional) {
        props.push(finalPropName)
      } else {
        props.push(`${finalPropName} = sdn.${finalPropName}`)
      }

      // Process children with updated conditional status
      if (Array.isArray(node.children)) {
        // Get validation for this node's children
        const childValidation = validateTreeNodeProps(node)

        node.children.forEach((child) =>
          traverseTreeAndAddProps(
            child,
            childValidation.validProps,
            isConditional, // Pass down conditional status to grandchildren
          ),
        )
      }
    } else {
      // Even if prop name already used, still need to process children
      if (Array.isArray(node.children)) {
        const childValidation = validateTreeNodeProps(node)

        const isConditional = isConditionalProp(
          node.dataBinding.path,
          validProps,
          [],
        )

        node.children.forEach((child) =>
          traverseTreeAndAddProps(
            child,
            childValidation.validProps,
            isConditional,
          ),
        )
      }
    }
  }

  if (Array.isArray(component.tree.children)) {
    // Validate component props and include ALL props in the spread (both valid and invalid)
    const validation = validateExportedComponentProps(component)

    // Traverse all children and pass the validation results
    component.tree.children.forEach((child) =>
      traverseTreeAndAddProps(child, validation.validProps),
    )
  }

  props.push("...props")
  return `{${props.join(",")}}`
}

/**
 * Generate the full React function signature
 */
export function generateReactFunctionSignature(
  component: ComponentToExport,
  propNamesMap: Map<string, string> = new Map(),
): string {
  const componentName = component.name
  const interfaceName =
    component.tree.dataBinding.interfaceName || `${componentName}Props`
  return `export function ${componentName}(props: ${interfaceName})`
}

// The generatePropsSpread function is already exported above

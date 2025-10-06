import { ComponentToExport, JSONTreeNode } from "../../types"
import {
  getComponentIdFromComponent,
  validateComponentProps,
} from "../validation/validate-component-props"

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

  if ("htmlElement" in component.tree.dataBinding.props) {
    props.push("htmlElement")
    usedPropNames.add("htmlElement")
  }
  if ("icon" in component.tree.dataBinding.props) {
    props.push(`icon = "${component.tree.dataBinding.props.icon.defaultValue}"`)
    usedPropNames.add("icon")
  }

  function traverseTreeAndAddProps(
    node: JSONTreeNode,
    validProps: JSONTreeNode[],
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

      // Only add default parameter assignment for non-conditional props
      if (isConditional) {
        props.push(finalPropName)
      } else {
        props.push(`${finalPropName} = sdn.${finalPropName}`)
      }
    }

    if (Array.isArray(node.children)) {
      node.children.forEach((child) =>
        traverseTreeAndAddProps(child, validProps),
      )
    }
  }

  if (Array.isArray(component.tree.children)) {
    // Validate component props and include ALL props in the spread (both valid and invalid)
    const componentId = getComponentIdFromComponent(component)
    const validation = componentId
      ? validateComponentProps(
          component.name,
          componentId,
          component.tree.children,
        )
      : {
          validProps: component.tree.children,
          invalidProps: [],
          componentHasFewerPropsThanSchema: false,
        }

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

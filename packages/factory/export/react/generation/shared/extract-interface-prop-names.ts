import { ComponentToExport, JSONTreeNode } from "../../../types"
import {
  validateExportedComponentProps,
  validateTreeNodeProps,
} from "../../validation/validate-component-props"

/**
 * Extracts prop names that should appear in the component's TypeScript interface.
 *
 * Traverses the component tree and collects prop names based on validation results.
 * For inline components, includes props for all children (valid and invalid) since
 * they become top-level props. For regular components, includes direct children and
 * grandchildren props.
 *
 * @param component - Component to extract interface prop names from
 * @param propNamesMap - Map of node paths to prop names
 * @returns Set of prop names that should appear in the interface (e.g., "icon", "icon2", "text", "text2")
 */
export function extractInterfacePropNames(
  component: ComponentToExport,
  propNamesMap: Map<string, string>,
): Set<string> {
  const interfacePropNames = new Set<string>()

  // Validate component props against schema
  const validation = validateExportedComponentProps(component)

  function traverse(node: JSONTreeNode) {
    // Get the final prop name from the centralized map
    const finalPropName = propNamesMap.get(node.dataBinding.path)

    if (finalPropName) {
      interfacePropNames.add(finalPropName)
    }

    if (Array.isArray(node.children)) {
      // Check if this component will be rendered inline
      const childValidation = validateTreeNodeProps(node)

      const willRenderInline = childValidation.invalidProps.length > 0

      if (willRenderInline) {
        // For inline components, include props for ALL children (valid and invalid)
        // because they will all become top-level props
        node.children.forEach((child) => {
          const childPropName = propNamesMap.get(child.dataBinding.path)
          if (childPropName) {
            interfacePropNames.add(childPropName)
          }

          // Also include props for children of children (e.g., icon, label for buttons)
          // because inline components render grandchildren as top-level props
          if (Array.isArray(child.children)) {
            child.children.forEach((grandchild) => {
              const grandchildPropName = propNamesMap.get(
                grandchild.dataBinding.path,
              )
              if (grandchildPropName) {
                interfacePropNames.add(grandchildPropName)
              }
            })
          }
        })
      } else {
        // For regular components (valid props), add direct children props
        // Also add grandchildren props because they are passed as props to the root component
        // (e.g., text={textProps} passed to BarStatus)
        node.children.forEach((child) => {
          const childPropName = propNamesMap.get(child.dataBinding.path)
          if (childPropName) {
            interfacePropNames.add(childPropName)
          }

          // Add grandchildren props - they are passed as props to parent components
          if (Array.isArray(child.children)) {
            child.children.forEach((grandchild) => {
              const grandchildPropName = propNamesMap.get(
                grandchild.dataBinding.path,
              )
              if (grandchildPropName) {
                interfacePropNames.add(grandchildPropName)
              }
            })
          }
        })
      }
    }
  }

  if (Array.isArray(component.tree.children)) {
    component.tree.children?.forEach((child) => traverse(child))
  }

  return interfacePropNames
}

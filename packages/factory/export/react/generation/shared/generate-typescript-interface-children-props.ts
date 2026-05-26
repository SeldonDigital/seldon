import { ComponentToExport, JSONTreeNode } from "../../../types"
import {
  validateExportedComponentProps,
  validateTreeNodeProps,
} from "../../validation/validate-component-props"

/**
 * Generate interface content for children props
 */
export function generateChildrenPropsContent(
  component: ComponentToExport,
  propNamesMap: Map<string, string>,
): string {
  let content = ""
  // Track added prop names to prevent duplicates in interface
  const addedPropNames = new Set<string>()

  // Validate component props against schema
  const validation = validateExportedComponentProps(component)

  function traverse(node: JSONTreeNode) {
    // Get the final prop name from the centralized map
    const finalPropName = propNamesMap.get(node.dataBinding.path)

    if (finalPropName && !addedPropNames.has(finalPropName)) {
      // Always add the prop for the current node (skip if already added)
      content += `${finalPropName}?: ${node.dataBinding.interfaceName}\n`
      addedPropNames.add(finalPropName)
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
          if (childPropName && !addedPropNames.has(childPropName)) {
            content += `${childPropName}?: ${child.dataBinding.interfaceName}\n`
            addedPropNames.add(childPropName)
          }

          // Also include props for children of children (e.g., icon, label for buttons)
          // because inline components render grandchildren as top-level props
          if (Array.isArray(child.children)) {
            child.children.forEach((grandchild) => {
              const grandchildPropName = propNamesMap.get(
                grandchild.dataBinding.path,
              )
              if (
                grandchildPropName &&
                !addedPropNames.has(grandchildPropName)
              ) {
                content += `${grandchildPropName}?: ${grandchild.dataBinding.interfaceName}\n`
                addedPropNames.add(grandchildPropName)
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
          if (childPropName && !addedPropNames.has(childPropName)) {
            content += `${childPropName}?: ${child.dataBinding.interfaceName}\n`
            addedPropNames.add(childPropName)
          }

          // Add grandchildren props - they are passed as props to parent components
          // The propNamesMap ensures unique names (e.g., text, text2, text3 for barStatus)
          // Use deduplication to prevent conflicts when same prop name appears in different branches
          if (Array.isArray(child.children)) {
            child.children.forEach((grandchild) => {
              const grandchildPropName = propNamesMap.get(
                grandchild.dataBinding.path,
              )
              if (
                grandchildPropName &&
                !addedPropNames.has(grandchildPropName)
              ) {
                content += `${grandchildPropName}?: ${grandchild.dataBinding.interfaceName}\n`
                addedPropNames.add(grandchildPropName)
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

  return content
}

/**
 * Generate the full TypeScript interface for children props
 */
export function generateTypescriptInterfaceChildrenProps(
  component: ComponentToExport,
  propNamesMap: Map<string, string>,
): string {
  const interfaceName = `${component.name}ChildrenProps`
  const propsContent = generateChildrenPropsContent(component, propNamesMap)

  if (propsContent === "") {
    return `export interface ${interfaceName} {}`
  }

  return `export interface ${interfaceName} {\n  ${propsContent}\n}`
}

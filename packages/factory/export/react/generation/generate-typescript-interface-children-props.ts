import { ComponentToExport, JSONTreeNode } from "../../types"
import {
  getComponentIdFromComponent,
  getComponentIdFromName,
  validateComponentProps,
} from "../validation/validate-component-props"
import { generatePropNamesMap } from "./generate-prop-names-map"

/**
 * Generate interface content for children props
 */
export function generateChildrenPropsContent(
  component: ComponentToExport,
): string {
  let content = ""

  // Use the same prop names map that will be used in the component function
  const propNamesMap = generatePropNamesMap(component)

  // Validate component props against schema
  const componentId = getComponentIdFromComponent(component)
  const validation =
    componentId && Array.isArray(component.tree.children)
      ? validateComponentProps(
          component.name,
          componentId,
          component.tree.children,
        )
      : {
          validProps: component.tree.children || [],
          invalidProps: [],
          componentHasFewerPropsThanSchema: false,
        }

  function traverse(node: JSONTreeNode) {
    // Get the final prop name from the centralized map
    const finalPropName = propNamesMap.get(node.dataBinding.path)

    if (finalPropName) {
      // Always add the prop for the current node
      content += `${finalPropName}?: ${node.dataBinding.interfaceName}\n`
    }

    if (Array.isArray(node.children)) {
      // Check if this component will be rendered inline
      const componentId = getComponentIdFromName(node.name)
      const childValidation = componentId
        ? validateComponentProps(node.name, componentId, node.children)
        : {
            validProps: node.children,
            invalidProps: [],
            componentHasFewerPropsThanSchema: false,
          }

      const willRenderInline = childValidation.invalidProps.length > 0

      if (willRenderInline) {
        // For inline components, include props for ALL children (valid and invalid)
        // because they will all become top-level props
        node.children.forEach((child) => {
          const childPropName = propNamesMap.get(child.dataBinding.path)
          if (childPropName) {
            content += `${childPropName}?: ${child.dataBinding.interfaceName}\n`
          }

          // Also include props for children of children (e.g., icon, label for buttons)
          if (Array.isArray(child.children)) {
            child.children.forEach((grandchild) => {
              const grandchildPropName = propNamesMap.get(
                grandchild.dataBinding.path,
              )
              if (grandchildPropName) {
                content += `${grandchildPropName}?: ${grandchild.dataBinding.interfaceName}\n`
              }
            })
          }
        })
      } else {
        // Normal traversal for non-inline components
        node.children.forEach((child) => traverse(child))
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
): string {
  const interfaceName = `${component.name}ChildrenProps`
  const propsContent = generateChildrenPropsContent(component)

  if (propsContent === "") {
    return `export interface ${interfaceName} {}`
  }

  return `export interface ${interfaceName} {\n  ${propsContent}\n}`
}

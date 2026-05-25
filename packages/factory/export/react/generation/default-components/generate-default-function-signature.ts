import { ComponentToExport, JSONTreeNode } from "../../../types"

/**
 * Generate function signature props spread for default components
 * Default components have all valid props with default values
 */
export function generateDefaultComponentPropsSpread(
  component: ComponentToExport,
  propValuesMap: Map<string, string>,
): string {
  const props = [`className = ""`]
  const usedPropNames = new Set<string>(["className"])

  // Process root-level props from component.tree.dataBinding.props
  const rootProps = component.tree.dataBinding.props
  for (const [propKey] of Object.entries(rootProps)) {
    if (!usedPropNames.has(propKey)) {
      usedPropNames.add(propKey)
      props.push(`${propKey} = sdn.${propKey}`)
    }
  }

  // Add all direct children props with defaults (default components have all valid props)
  // Also include grandchildren props when they are passed as props to child components
  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach((child) => {
      const childPropName = propValuesMap.get(child.dataBinding.path)
      if (childPropName && !usedPropNames.has(childPropName)) {
        usedPropNames.add(childPropName)
        // All props in default components have defaults
        props.push(`${childPropName} = sdn.${childPropName}`)
      }

      // Add grandchildren props to function signature
      // Grandchildren props inherit parent numbers (e.g., buttonIconic2 → buttonIconic2Icon)
      if (Array.isArray(child.children)) {
        child.children.forEach((grandchild) => {
          const grandchildPropName = propValuesMap.get(
            grandchild.dataBinding.path,
          )
          if (grandchildPropName && !usedPropNames.has(grandchildPropName)) {
            usedPropNames.add(grandchildPropName)
            // All props in default components have defaults
            props.push(`${grandchildPropName} = sdn.${grandchildPropName}`)
          }
        })
      }
    })
  }

  props.push("...props")
  return `{${props.join(",")}}`
}

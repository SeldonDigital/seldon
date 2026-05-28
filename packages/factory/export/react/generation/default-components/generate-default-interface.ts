import { ComponentToExport, JSONTreeNode } from "../../../types"

/**
 * Generate interface content for default component children props
 * Default components have valid props matching the schema, no conditional/invalid props
 * Includes grandchildren props when grandchildren are passed as props to child components
 *
 * Direct children use propKeysMap (matches child component's interface prop keys)
 * Grandchildren use propValuesMap (parent component's prop value names like "barTabsIcon")
 */
export function generateDefaultComponentChildrenProps(
  component: ComponentToExport,
  propKeysMap: Map<string, string>,
  propValuesMap: Map<string, string>,
): string {
  let content = ""
  const addedPropNames = new Set<string>()

  // Default components only have valid props, so we process all direct children
  // Also include grandchildren props when they are passed as props to child components
  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach((child) => {
      const childPropKey = propKeysMap.get(child.dataBinding.path)
      if (childPropKey && !addedPropNames.has(childPropKey)) {
        content += `${childPropKey}?: ${child.dataBinding.interfaceName}\n`
        addedPropNames.add(childPropKey)
      }

      // Process grandchildren props - these are passed as props to direct children
      // Use propValuesMap for grandchildren (parent component's prop value names like "barTabsIcon")
      if (Array.isArray(child.children)) {
        child.children.forEach((grandchild) => {
          const grandchildPropValue = propValuesMap.get(
            grandchild.dataBinding.path,
          )
          if (grandchildPropValue && !addedPropNames.has(grandchildPropValue)) {
            content += `${grandchildPropValue}?: ${grandchild.dataBinding.interfaceName}\n`
            addedPropNames.add(grandchildPropValue)
          }
        })
      }
    })
  }

  return content
}

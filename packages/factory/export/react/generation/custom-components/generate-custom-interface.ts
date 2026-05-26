import { ComponentToExport, JSONTreeNode } from "../../../types"

/**
 * Generate interface content for custom component children props
 * Custom components have invalid props (conditional props) at the root level
 * Custom components DO have grandchildren props that are passed to direct children
 *
 * This function includes:
 * - All direct children props (both valid and invalid/conditional) - uses propKeysMap
 * - All grandchildren props (passed as props to direct children) - uses propValuesMap
 *
 * Direct children use propKeysMap (matches child component's interface prop keys)
 * Grandchildren use propValuesMap (parent component's prop value names like "barTabsIcon")
 */
export function generateCustomComponentChildrenProps(
  component: ComponentToExport,
  propKeysMap: Map<string, string>,
  propValuesMap: Map<string, string>,
): string {
  let content = ""
  const addedPropNames = new Set<string>()

  // Process direct children and all descendants recursively
  // Direct children: Process from component.tree.children
  // Descendants (depth 2+): Process recursively, using propValuesMap for all descendant props
  function processDescendants(node: JSONTreeNode) {
    // Process direct child prop key (from propKeysMap - matches child component's interface)
    const childPropKey = propKeysMap.get(node.dataBinding.path)

    if (childPropKey && !addedPropNames.has(childPropKey)) {
      content += `${childPropKey}?: ${node.dataBinding.interfaceName}\n`
      addedPropNames.add(childPropKey)
    }

    // Process all descendants recursively - these are passed as props to parent components
    // All descendants use propValuesMap (parent component's prop value names like "buttonIcon", "frameButtonIconicIcon")
    if (Array.isArray(node.children)) {
      node.children.forEach((descendant) => {
        const descendantPropValue = propValuesMap.get(
          descendant.dataBinding.path,
        )
        if (descendantPropValue && !addedPropNames.has(descendantPropValue)) {
          content += `${descendantPropValue}?: ${descendant.dataBinding.interfaceName}\n`
          addedPropNames.add(descendantPropValue)
        }

        // Recursively process deeper descendants (depth 3+)
        processDescendants(descendant)
      })
    }
  }

  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach((child) => processDescendants(child))
  }

  return content
}

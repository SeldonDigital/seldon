import { ComponentToExport, JSONTreeNode } from "../../../types"

/**
 * Generate interface content for inline component children props
 * Inline components have valid props but invalid grandchildren
 * We include ALL props including grandchildren props (both valid and invalid)
 *
 * Direct children use propKeysMap (matches child component's interface prop keys)
 * Grandchildren use propValuesMap (parent component's prop value names)
 */
export function generateInlineComponentChildrenProps(
  component: ComponentToExport,
  propKeysMap: Map<string, string>,
  propValuesMap: Map<string, string>,
): string {
  let content = ""
  const addedPropNames = new Set<string>()

  function traverse(node: JSONTreeNode, depth: number = 1) {
    // For direct children (depth 1), use propKeysMap
    // For grandchildren (depth 2+), use propValuesMap
    const propName =
      depth === 1
        ? propKeysMap.get(node.dataBinding.path)
        : propValuesMap.get(node.dataBinding.path)

    // Add this node's prop to interface if not already added
    if (propName && !addedPropNames.has(propName)) {
      content += `${propName}?: ${node.dataBinding.interfaceName}\n`
      addedPropNames.add(propName)
    }

    // Recursively traverse all children and grandchildren
    // Inline components include ALL props (children and grandchildren) as top-level props
    if (Array.isArray(node.children)) {
      node.children.forEach((child) => {
        // Recursively traverse to handle all levels of nesting
        traverse(child, depth + 1)
      })
    }
  }

  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach((child) => traverse(child, 1))
  }

  return content
}

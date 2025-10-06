import { ComponentToExport, JSONTreeNode } from "../../types"
import { getHumanReadablePropName } from "../discovery/get-human-readable-prop-name"

/**
 * Generate a consistent mapping of node paths to final prop names
 * This ensures the same prop names are used in interface, function params, and JSX
 */
export function generatePropNamesMap(
  component: ComponentToExport,
): Map<string, string> {
  const propNamesMap = new Map<string, string>()
  const baseNameCounts = new Map<string, number>()

  function traverse(node: JSONTreeNode) {
    const simplifiedPropName = getHumanReadablePropName(node.dataBinding.path, {
      simplifiedPropNames: true,
      parentComponentName: component.name,
    })

    // Extract the base name (remove any existing numbers and "Props" suffix for counting)
    const baseName = simplifiedPropName
      .replace(/\d+$/, "")
      .replace(/Props$/, "")

    // Track how many times we've seen this base name
    const currentCount = baseNameCounts.get(baseName) || 0
    const newCount = currentCount + 1
    baseNameCounts.set(baseName, newCount)

    // Generate final prop name with numbering for duplicates
    let finalPropName: string
    if (newCount === 1) {
      // First occurrence keeps the original simplified name
      finalPropName = simplifiedPropName
    } else {
      // Subsequent occurrences get numbered
      if (simplifiedPropName.endsWith("Props")) {
        // Handle Props suffix correctly: titleProps -> title2Props
        const baseWithoutProps = simplifiedPropName.replace(/Props$/, "")
        finalPropName = `${baseWithoutProps}${newCount}Props`
      } else {
        // Regular names: button -> button2
        finalPropName = `${baseName}${newCount}`
      }
    }

    propNamesMap.set(node.dataBinding.path, finalPropName)

    if (Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }

  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach(traverse)
  }

  return propNamesMap
}

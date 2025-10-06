import { getCssStringFromCssObject } from "../../../styles/css-properties/get-css-string-from-css-object"
import {
  TransformStrategy,
  transformSource,
} from "../../react/utils/transform-source"
import { Classes } from "../types"

/**
 * Insert the styles for each node in the workspace into the stylesheet
 * @param stylesheet - The stylesheet to insert the styles into
 * @param classes - The classes to insert into the stylesheet
 * @param classNameToNodeId - Optional mapping from class names to node IDs for tree-aware sorting
 * @param nodeTreeDepths - Optional mapping from node IDs to their tree depths
 * @returns The stylesheet with the styles for each node in the workspace inserted
 */
export function insertNodeStyles(
  stylesheet: string,
  classes: Classes,
  classNameToNodeId?: Record<string, string>,
  nodeTreeDepths?: Record<string, number>,
) {
  // Sort classes by tree structure:
  // 1. Base classes first (e.g., "sdn-button")
  // 2. Then by tree depth (shallower nodes first)
  // 3. Then by component type alphabetically
  // 4. Finally by class name alphabetically
  // This ensures that deeper/more specific classes override shallower ones via CSS cascade
  const sortedEntries = Object.entries(classes).sort(
    ([classNameA], [classNameB]) => {
      // Check if classes are base component classes (e.g., "sdn-button") vs variant classes (e.g., "sdn-button-xyz")
      const isBaseA = !classNameA.match(/-[A-Za-z0-9]{8,}$/) // Base classes don't have long ID suffixes
      const isBaseB = !classNameB.match(/-[A-Za-z0-9]{8,}$/)

      // If one is base and one is variant, base comes first
      if (isBaseA && !isBaseB) return -1
      if (!isBaseA && isBaseB) return 1

      // If we have tree depth information, use it for sorting variant classes
      if (!isBaseA && !isBaseB && classNameToNodeId && nodeTreeDepths) {
        const nodeIdA = classNameToNodeId[classNameA]
        const nodeIdB = classNameToNodeId[classNameB]

        if (nodeIdA && nodeIdB) {
          const depthA = nodeTreeDepths[nodeIdA] || 0
          const depthB = nodeTreeDepths[nodeIdB] || 0

          // Sort by depth first (shallower first)
          if (depthA !== depthB) {
            return depthA - depthB
          }

          // If same depth, extract component base name and sort by that
          const baseNameA = classNameA.replace(/-[A-Za-z0-9]{8,}$/, "")
          const baseNameB = classNameB.replace(/-[A-Za-z0-9]{8,}$/, "")

          if (baseNameA !== baseNameB) {
            return baseNameA.localeCompare(baseNameB)
          }
        }
      }

      // For variant classes without tree depth info, sort by component name then class name
      if (!isBaseA && !isBaseB) {
        // Extract the component base name (e.g., "sdn-title" from "sdn-title-83oQ44Bx")
        const baseNameA = classNameA.replace(/-[A-Za-z0-9]{8,}$/, "")
        const baseNameB = classNameB.replace(/-[A-Za-z0-9]{8,}$/, "")

        // If they're for the same component, put them in a predictable order
        if (baseNameA === baseNameB) {
          // Sort by the hash/ID part to ensure consistent ordering
          return classNameA.localeCompare(classNameB)
        }

        // Different components, sort by component name
        return baseNameA.localeCompare(baseNameB)
      }

      // For base classes, maintain alphabetical order for consistency
      return classNameA.localeCompare(classNameB)
    },
  )

  const componentStyles = sortedEntries.map(([className, css]) => {
    return getCssStringFromCssObject(css, className)
  })

  return transformSource({
    source: stylesheet,
    strategy: TransformStrategy.APPEND,
    content: `

/********************************************
 *                                          *
 *             Component styles             *
 *                                          *
 ********************************************/

${componentStyles.join("\n\n")}
`,
  })
}

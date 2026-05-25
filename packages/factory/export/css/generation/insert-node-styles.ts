import { Workspace } from "@seldon/core"
import { typeCheckingService } from "@seldon/core/workspace/services"
import { getCssStringFromCssObject } from "../../../styles/css-properties/get-css-string-from-css-object"
import {
  TransformStrategy,
  transformSource,
} from "../../react/utils/transform-source"
import { Classes } from "../types"

export function insertNodeStyles(
  stylesheet: string,
  classes: Classes,
  workspace: Workspace,
  classNameToNodeId?: Record<string, string>,
  nodeTreeDepths?: Record<string, number>,
) {
  const sortedEntries = Object.entries(classes).sort(
    ([classNameA], [classNameB]) => {
      const isInstanceA = classNameA.includes("--")
      const isInstanceB = classNameB.includes("--")

      if (isInstanceA && !isInstanceB) return 1
      if (!isInstanceA && isInstanceB) return -1

      if (!isInstanceA && !isInstanceB && classNameToNodeId) {
        const nodeIdA = classNameToNodeId[classNameA]
        const nodeIdB = classNameToNodeId[classNameB]

        if (nodeIdA && nodeIdB) {
          const nodeA = workspace.nodes[nodeIdA]
          const nodeB = workspace.nodes[nodeIdB]

          const isVariantA = nodeA && typeCheckingService.isVariant(nodeA)
          const isVariantB = nodeB && typeCheckingService.isVariant(nodeB)

          if (isVariantA && !isVariantB) return -1
          if (!isVariantA && isVariantB) return 1

          if (nodeTreeDepths) {
            const depthA = nodeTreeDepths[nodeIdA] || 0
            const depthB = nodeTreeDepths[nodeIdB] || 0
            if (depthA !== depthB) {
              return depthA - depthB
            }
          }

          const baseNameA = classNameA.replace(/--[a-z0-9]{4}$/, "")
          const baseNameB = classNameB.replace(/--[a-z0-9]{4}$/, "")

          if (baseNameA !== baseNameB) {
            return baseNameA.localeCompare(baseNameB)
          }

          return classNameA.localeCompare(classNameB)
        }
      }

      if (!isInstanceA && !isInstanceB) {
        const baseNameA = classNameA.replace(/--[a-z0-9]{4}$/, "")
        const baseNameB = classNameB.replace(/--[a-z0-9]{4}$/, "")

        if (baseNameA === baseNameB) {
          return classNameA.localeCompare(classNameB)
        }

        return baseNameA.localeCompare(baseNameB)
      }

      return classNameA.localeCompare(classNameB)
    },
  )

  const componentStyles = sortedEntries
    .map(([className, css]) => getCssStringFromCssObject(css, className))
    .filter((cssString) => {
      const isEmptyRule = /^\.\S+\s*\{\s*\}$/.test(cssString.trim())
      return !isEmptyRule
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

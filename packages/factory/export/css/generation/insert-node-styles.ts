import { Workspace } from "@seldon/core"
import { typeCheckingService } from "@seldon/core/workspace/services"

import { getCssStringFromCssObject } from "../../../styles/css-properties/get-css-string-from-css-object"
import type { CSSObject } from "../../../styles/css-properties/types"
import {
  TransformStrategy,
  transformSource,
} from "../../react/utils/transform-source"
import { Classes, DescendantStateClasses, StateClasses } from "../types"
import {
  getAncestorStateSelectorSuffixes,
  getStateSelectorSuffixes,
} from "./state-selectors"

/**
 * Builds the interaction-state CSS rules for one class. Each state emits a rule
 * whose selector groups the state's suffixes, so equal-specificity rules resolve
 * by source order. State rules come after the base rule for the same class.
 */
function buildStateRules(
  className: string,
  statesByName: { [stateName: string]: CSSObject },
): string[] {
  const rules: string[] = []
  for (const [stateName, css] of Object.entries(statesByName)) {
    if (Object.keys(css).length === 0) continue
    const selector = getStateSelectorSuffixes(stateName)
      .map((suffix) => `.${className}${suffix}`)
      .join(", ")
    rules.push(getCssStringFromCssObject(css, className, selector))
  }
  return rules
}

/**
 * Builds the root-scoped interaction-state rules. A container row owns the
 * interaction, so a descendant rule reads `.{root}{ancestorSuffix} .{descendant}`
 * and the root's own delta reads `.{root}{ancestorSuffix}`. The ancestor suffix
 * cascades the state from the row to its subtree, matching the canvas preview.
 */
function buildDescendantStateRules(
  descendantStateClasses: DescendantStateClasses,
): string[] {
  const rules: string[] = []
  for (const [rootClass, statesByName] of Object.entries(
    descendantStateClasses,
  )) {
    for (const [stateName, stateRules] of Object.entries(statesByName)) {
      const suffixes = getAncestorStateSelectorSuffixes(stateName)
      for (const { descendantClass, css } of stateRules) {
        if (Object.keys(css).length === 0) continue
        const selector = suffixes
          .map((suffix) =>
            descendantClass
              ? `.${rootClass}${suffix} .${descendantClass}`
              : `.${rootClass}${suffix}`,
          )
          .join(", ")
        rules.push(getCssStringFromCssObject(css, rootClass, selector))
      }
    }
  }
  return rules
}

export function insertNodeStyles(
  stylesheet: string,
  classes: Classes,
  workspace: Workspace,
  classNameToNodeId?: Record<string, string>,
  nodeTreeDepths?: Record<string, number>,
  stateClasses?: StateClasses,
  descendantStateClasses?: DescendantStateClasses,
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

  const componentStyles = sortedEntries.flatMap(([className, css]) => {
    const rules: string[] = []

    const baseRule = getCssStringFromCssObject(css, className)
    const isEmptyRule = /^\.\S+\s*\{\s*\}$/.test(baseRule.trim())
    if (!isEmptyRule) rules.push(baseRule)

    // State rules follow the base rule for the same class so equal-specificity
    // rules resolve by source order, and the variant carries the state for the
    // instances that share its class.
    const statesByName = stateClasses?.[className]
    if (statesByName) rules.push(...buildStateRules(className, statesByName))

    return rules
  })

  // Root-scoped state rules come after every base and self-state rule so the
  // higher-specificity descendant selectors resolve last by source order.
  const descendantStateRules = descendantStateClasses
    ? buildDescendantStateRules(descendantStateClasses)
    : []

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
${descendantStateRules.length > 0 ? `\n${descendantStateRules.join("\n\n")}\n` : ""}`,
  })
}

import { camelCase } from "../../utils/case-utils"
import { getVariantClassNames } from "../../utils/class-name"
import { getConditionalPropPaths } from "./get-conditional-prop-paths"
import { getSubtreeBoundaryPropNames, joinWithSubtreeBreaks } from "./get-subtree-boundaries"

import type { NodeIdToClass } from "../../../css/types"
import type { ComponentToExport, JSONTreeNode } from "../../../types"

interface DeclarationEntry {
  line: string
  name?: string
}

/**
 * Generates the component's variable declarations.
 *
 * Always declares the component className. Then, for every node in the tree,
 * declares a merged props variable that layers the caller's prop and matching
 * `seldonRefs` override over the default (`sdn`) entry. `mergeSlot` renders the
 * slot unless the caller passes `null`; `mergeOptionalSlot` renders a
 * conditional slot only when the caller passes props for it. Either way a
 * suppressed slot resolves to `null`, so suppression flows into
 * grandchild-as-prop slots and every guard is a single `!== null` check.
 * Declarations are deduplicated by variable name.
 *
 * A blank line opens each top-level subtree, so the list breaks at the same
 * places as the interface, the signature, and the `sdn` block.
 */
export function generateVariableDeclarations(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  propNames: Map<string, string>,
): { declarations: string; classNameVarName: string } {
  const { tree } = component

  const classNameVarName = `${camelCase(component.name)}ClassName`

  const declarations: DeclarationEntry[] = []
  const variantClassNames = getVariantClassNames(component, nodeIdToClass)

  declarations.push({
    line: `const ${classNameVarName} = combineClassNames("${variantClassNames}", className)`,
  })

  if (!Array.isArray(tree.children)) {
    return {
      declarations: `\n  ${declarations[0].line}\n`,
      classNameVarName,
    }
  }

  const declared = new Set<string>()
  const conditionalPaths = getConditionalPropPaths(component)

  function traverse(node: JSONTreeNode) {
    const propsName = propNames.get(node.dataBinding.path)

    if (!propsName) {
      throw new Error(
        `Prop path "${node.dataBinding.path}" not found in prop names for component "${component.name}"`,
      )
    }

    const propsVarName = `${propsName}Props`

    if (!declared.has(propsVarName)) {
      declared.add(propsVarName)

      const helper = conditionalPaths.has(node.dataBinding.path) ? "mergeOptionalSlot" : "mergeSlot"

      declarations.push({
        line: `const ${propsVarName} = ${helper}(sdn.${propsName}, ${propsName}, seldonRefs)`,
        name: propsName,
      })
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }

  tree.children.forEach(traverse)

  // The className declaration is its own cluster, so the first slot always opens
  // a new one regardless of the boundary set.
  const boundaries = getSubtreeBoundaryPropNames(component, propNames)
  const [classNameDeclaration, ...slotDeclarations] = declarations

  const body =
    slotDeclarations.length > 0
      ? `${classNameDeclaration.line}\n\n${joinWithSubtreeBreaks(slotDeclarations, boundaries)}`
      : classNameDeclaration.line

  return {
    declarations: `\n  ${body.split("\n").join("\n  ")}\n`,
    classNameVarName,
  }
}

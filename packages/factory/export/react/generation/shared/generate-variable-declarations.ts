import { NodeIdToClass } from "../../../css/types"
import { ComponentToExport, JSONTreeNode } from "../../../types"
import { camelCase } from "../../utils/case-utils"
import { getVariantClassNames } from "../../utils/class-name"

/**
 * Generates the component's variable declarations.
 *
 * Always declares the component className. Then, for every node in the tree,
 * declares a merged props variable that layers the passed-in prop over the
 * default (`sdn`) entry and combines class names. A null prop resolves to a
 * null props variable so suppression flows into grandchild-as-prop slots.
 * Declarations are deduplicated by variable name.
 */
export function generateVariableDeclarations(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  propNames: Map<string, string>,
): { declarations: string; classNameVarName: string } {
  const { tree } = component

  const classNameVarName = `${camelCase(component.name)}ClassName`

  const declarations: string[] = []
  const variantClassNames = getVariantClassNames(component, nodeIdToClass)
  declarations.push(
    `const ${classNameVarName} = combineClassNames("${variantClassNames}", className)`,
  )

  if (!Array.isArray(tree.children)) {
    return {
      declarations: "\n  " + declarations.join("\n  ") + "\n",
      classNameVarName,
    }
  }

  const declared = new Set<string>()

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
      // Wrap the merged slot props with `applyRef` so a caller can override this
      // slot by its `data-seldon-ref` name. The ref rides on the merged object,
      // so `applyRef` resolves and layers the matching override last.
      declarations.push(
        `const ${propsVarName} = applyRef(seldonRefs, ${propsName} === null ? null : { ...sdn.${propsName}, ...${propsName}, className: combineClassNames(sdn.${propsName}?.className, ${propsName}?.className) })`,
      )
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }

  tree.children.forEach(traverse)

  return {
    declarations:
      declarations.length > 0 ? "\n  " + declarations.join("\n  ") + "\n" : "",
    classNameVarName,
  }
}

import { NodeIdToClass } from "../../../css/types"
import { ComponentToExport, JSONTreeNode } from "../../../types"
import { camelCase } from "../../utils/case-utils"
import { getVariantClassNames } from "../../utils/class-name"

/**
 * Generate variable declarations for inline components
 * Inline components include all props (valid and invalid) in variable declarations
 * Similar to custom components but with grandchildren handling
 */
export function generateInlineComponentVariableDeclarations(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  propValuesMap: Map<string, string>,
): { declarations: string; classNameVarName: string } {
  const { tree } = component

  // Generate component-specific className variable name
  const classNameVarName = `${camelCase(component.name)}ClassName`

  const declarations: string[] = []

  // Always generate component-specific className declaration
  const variantClassNames = getVariantClassNames(component, nodeIdToClass)
  declarations.push(
    `const ${classNameVarName} = combineClassNames("${variantClassNames}", className)`,
  )

  // Only process children if they exist
  if (!Array.isArray(tree.children)) {
    return {
      declarations: "\n  " + declarations.join("\n  ") + "\n",
      classNameVarName,
    }
  }

  const declaredPropNames = new Set<string>()

  function traverseAndGenerateDeclarations(node: JSONTreeNode) {
    const propsName = propValuesMap.get(node.dataBinding.path)
    if (!propsName) {
      throw new Error(
        `Prop path "${node.dataBinding.path}" not found in propValuesMap for component "${component.name}"`,
      )
    }

    const propsVarName = `${propsName}Props`

    // Only declare if we haven't already declared this prop name
    // Inline components include ALL props (valid and invalid) in declarations
    if (!declaredPropNames.has(propsVarName)) {
      declaredPropNames.add(propsVarName)
      declarations.push(
        `const ${propsVarName} = { ...sdn.${propsName}, ...${propsName}, className: combineClassNames(sdn.${propsName}?.className, ${propsName}?.className) }`,
      )
    }

    // Process children recursively (including grandchildren)
    if (Array.isArray(node.children)) {
      node.children.forEach(traverseAndGenerateDeclarations)
    }
  }

  tree.children.forEach(traverseAndGenerateDeclarations)

  return {
    declarations:
      declarations.length > 0 ? "\n  " + declarations.join("\n  ") + "\n" : "",
    classNameVarName,
  }
}

import { NodeIdToClass } from "../../../css/types"
import { ComponentToExport, JSONTreeNode } from "../../../types"
import { camelCase } from "../../utils/case-utils"
import { getVariantClassNames } from "../../utils/class-name"

/**
 * Generate variable declarations for custom components
 * Custom components include all props (valid and invalid) in variable declarations
 * Custom components DO have grandchildren props that need variable declarations
 *
 * This function generates variable declarations for:
 * - All direct children props (both valid and invalid/conditional)
 * - All grandchildren props (passed as props to direct children)
 *
 * Grandchildren prop names inherit parent numbers (e.g., buttonIconic2 → buttonIconic2Icon)
 * Variable names match prop names from propValuesMap exactly
 */
export function generateCustomComponentVariableDeclarations(
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

  /**
   * Traverse tree and generate variable declarations
   * Processes: direct children props + grandchildren props
   * All props (valid, invalid, and grandchildren) get variable declarations
   */
  function traverseAndGenerateDeclarations(node: JSONTreeNode) {
    const propsName = propValuesMap.get(node.dataBinding.path)
    if (!propsName) {
      throw new Error(
        `Prop path "${node.dataBinding.path}" not found in propValuesMap for component "${component.name}"`,
      )
    }

    const propsVarName = `${propsName}Props`

    // Only declare if we haven't already declared this prop name
    // Custom components include ALL props (valid, invalid, and grandchildren) in declarations
    if (!declaredPropNames.has(propsVarName)) {
      declaredPropNames.add(propsVarName)
      declarations.push(
        `const ${propsVarName} = { ...sdn.${propsName}, ...${propsName}, className: combineClassNames(sdn.${propsName}?.className, ${propsName}?.className) }`,
      )
    }

    // Process children (grandchildren) recursively
    // Grandchildren props get variable declarations (e.g., buttonIconic2IconProps)
    if (Array.isArray(node.children)) {
      node.children.forEach(traverseAndGenerateDeclarations)
    }
  }

  // Process all direct children (which includes their grandchildren)
  tree.children.forEach(traverseAndGenerateDeclarations)

  return {
    declarations:
      declarations.length > 0 ? "\n  " + declarations.join("\n  ") + "\n" : "",
    classNameVarName,
  }
}

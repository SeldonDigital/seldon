import { NodeIdToClass } from "../../../css/types"
import { ComponentToExport, JSONTreeNode } from "../../../types"
import { camelCase } from "../../utils/case-utils"
import { getVariantClassNames } from "../../utils/class-name"

/**
 * Generate variable declarations for default components
 * Default components have all valid props, so all props get variable declarations
 */
export function generateDefaultComponentVariableDeclarations(
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

  // Generate variable declarations for all direct children props
  // Also generate declarations for grandchildren props when they are passed as props to child components
  tree.children.forEach((child) => {
    const propsName = propValuesMap.get(child.dataBinding.path)
    if (!propsName) {
      throw new Error(
        `Prop path "${child.dataBinding.path}" not found in propValuesMap for component "${component.name}"`,
      )
    }

    const propsVarName = `${propsName}Props`

    // Only declare if we haven't already declared this prop name
    if (!declaredPropNames.has(propsVarName)) {
      declaredPropNames.add(propsVarName)
      declarations.push(
        `const ${propsVarName} = { ...sdn.${propsName}, ...${propsName}, className: combineClassNames(sdn.${propsName}?.className, ${propsName}?.className) }`,
      )
    }

    // Generate variable declarations for grandchildren props
    // Grandchildren props inherit parent numbers (e.g., buttonIconic2 → buttonIconic2Icon)
    if (Array.isArray(child.children)) {
      child.children.forEach((grandchild) => {
        const grandchildPropName = propValuesMap.get(
          grandchild.dataBinding.path,
        )
        if (!grandchildPropName) {
          throw new Error(
            `Prop path "${grandchild.dataBinding.path}" not found in propValuesMap for component "${component.name}"`,
          )
        }

        const grandchildPropsVarName = `${grandchildPropName}Props`

        // Only declare if we haven't already declared this prop name
        if (!declaredPropNames.has(grandchildPropsVarName)) {
          declaredPropNames.add(grandchildPropsVarName)
          declarations.push(
            `const ${grandchildPropsVarName} = { ...sdn.${grandchildPropName}, ...${grandchildPropName}, className: combineClassNames(sdn.${grandchildPropName}?.className, ${grandchildPropName}?.className) }`,
          )
        }
      })
    }
  })

  return {
    declarations:
      declarations.length > 0 ? "\n  " + declarations.join("\n  ") + "\n" : "",
    classNameVarName,
  }
}

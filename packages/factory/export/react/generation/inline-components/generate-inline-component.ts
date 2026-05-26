import { ComponentToExport, JSONTreeNode } from "../../../types"
import { ComponentMetadataStorage } from "../component-metadata"
import { getPropName } from "../shared/get-prop-name"

/**
 * Generate an Inline Component
 * Invalid child props → wraps this part in a Frame, and then renders children inline as regular components
 */
export function generateInlineComponent(
  node: JSONTreeNode,
  component: ComponentToExport,
  propsName: string,
  propValuesMap: Map<string, string>,
  propKeysMap: Map<string, string>,
  childValidation: {
    validProps: JSONTreeNode[]
    invalidProps: JSONTreeNode[]
  },
  componentMetadataStorage: ComponentMetadataStorage,
): string {
  const propsVarName = `${propsName}Props`
  let content = `\n      <Frame {...${propsVarName}}>`

  if (Array.isArray(node.children)) {
    node.children.forEach((child: JSONTreeNode) => {
      const childIsValid = childValidation.validProps.some(
        (validChild: JSONTreeNode) =>
          validChild.dataBinding.path === child.dataBinding.path,
      )

      const childPropName = getPropName(
        child.dataBinding.path,
        propValuesMap,
        component.name,
      )
      const childPropsVarName = `${childPropName}Props`

      // Build grandchild props
      const grandchildProps: string[] = []
      if (Array.isArray(child.children)) {
        for (const grandchild of child.children) {
          const grandchildPath = grandchild.dataBinding.path
          const grandchildPropValue = getPropName(
            grandchildPath,
            propValuesMap,
            component.name,
          )
          const grandchildPropsVarName = `${grandchildPropValue}Props`

          // Get prop key from propKeysMap (matches child component's interface)
          const grandchildPropKey = propKeysMap.get(grandchildPath)
          if (!grandchildPropKey) {
            // Fallback: use prop value name if prop key not found
            grandchildProps.push(
              `${grandchildPropValue}={${grandchildPropsVarName}}`,
            )
            continue
          }

          grandchildProps.push(
            `${grandchildPropKey}={${grandchildPropsVarName}}`,
          )
        }
      }

      const childPropsString =
        grandchildProps.length > 0 ? " " + grandchildProps.join(" ") : ""

      if (childIsValid) {
        content += `\n        <${child.name} {...${childPropsVarName}}${childPropsString} />`
      } else {
        content += `\n        {${childPropName} && (
          <${child.name} {...${childPropsVarName}}${childPropsString} />
        )}`
      }
    })
  }

  content += `\n      </Frame>`
  return content
}

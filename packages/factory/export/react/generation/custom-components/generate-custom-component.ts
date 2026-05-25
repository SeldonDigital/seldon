import { Workspace } from "@seldon/core"
import { ComponentToExport, JSONTreeNode } from "../../../types"
import { ComponentMetadataStorage } from "../component-metadata"
import { getPropName } from "../shared/get-prop-name"

/**
 * Generate a Custom Component
 * Invalid props (extra props that are not present in the schema) → conditional render of the component:
 * {propName && <Component />} to allow a component to show or hide depending on context
 *
 * Custom components DO have grandchildren props that are passed to direct children
 * Grandchildren props are passed as props to direct children (e.g., icon={buttonIconicIconProps})
 *
 * This handles custom components WITH grandchildren props passed to direct children
 * Components with grandchildren at the root level are handled by generateCustomInlineComponent
 */
export function generateCustomComponent(
  node: JSONTreeNode,
  component: ComponentToExport,
  propValuesMap: Map<string, string>,
  propKeysMap: Map<string, string>,
  componentMetadataStorage: ComponentMetadataStorage,
  workspace: Workspace,
): string {
  const propName = getPropName(
    node.dataBinding.path,
    propValuesMap,
    component.name,
  )
  const propsVarName = `${propName}Props`
  const childProps: string[] = []

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const path = child.dataBinding.path
      const childPropValue = getPropName(path, propValuesMap, component.name)
      const childPropsVarName = `${childPropValue}Props`

      // Get prop key from propKeysMap (matches child component's interface)
      const propKey = propKeysMap.get(path)
      if (!propKey) {
        // Fallback: use prop value name if prop key not found
        childProps.push(`${childPropValue}={${childPropsVarName}}`)
        continue
      }

      childProps.push(`${propKey}={${childPropsVarName}}`)

      // Handle grandchildren - pass grandchildren props to direct children
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
            childProps.push(
              `${grandchildPropValue}={${grandchildPropsVarName}}`,
            )
            continue
          }

          childProps.push(`${grandchildPropKey}={${grandchildPropsVarName}}`)
        }
      }
    }
  }

  const allProps = [`{...${propsVarName}}`, ...childProps].join(" ")
  return `\n      {${propName} && (
        <${node.name} ${allProps} />
      )}`
}

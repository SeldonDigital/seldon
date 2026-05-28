import { Workspace } from "@seldon/core"
import { ComponentToExport, JSONTreeNode } from "../../../types"
import { ComponentMetadataStorage } from "../component-metadata"
import { getPropName } from "../shared/get-prop-name"

/**
 * Generate a Default Component JSX with grandchildren passed as props
 * Used when a valid prop child has valid grandchildren matching its schema
 *
 * This works for both custom and default parent components.
 * The decision to use this function is based on:
 * - Child is a valid prop (matches parent's schema)
 * - Child has grandchildren (children of its own)
 * - Child's grandchildren are all valid (match child's schema)
 *
 * This generates JSX where grandchildren are passed as props to the child component
 * (e.g., <Button {...buttonProps} icon={iconProps} label={labelProps} />)
 * instead of rendering them as JSX children.
 *
 * This is different from generateDefaultComponent which renders grandchildren as JSX children.
 */
export function generateDefaultComponentWithGrandchildren(
  node: JSONTreeNode,
  component: ComponentToExport,
  propValuesMap: Map<string, string>,
  propKeysMap: Map<string, string>,
  componentMetadataStorage: ComponentMetadataStorage,
  workspace: Workspace,
): string {
  const propsName = getPropName(
    node.dataBinding.path,
    propValuesMap,
    component.name,
  )
  const propsVarName = `${propsName}Props`

  // Build grandchildren props to pass to the child component
  const grandchildProps: string[] = []
  if (Array.isArray(node.children)) {
    for (const grandchild of node.children) {
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

      grandchildProps.push(`${grandchildPropKey}={${grandchildPropsVarName}}`)
    }
  }

  const grandchildPropsString =
    grandchildProps.length > 0 ? " " + grandchildProps.join(" ") : ""

  // Generate self-closing tag with grandchildren as props
  return `\n        <${node.name} {...${propsVarName}}${grandchildPropsString} />`
}

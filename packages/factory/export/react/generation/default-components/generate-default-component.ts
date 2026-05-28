import { ComponentToExport, JSONTreeNode } from "../../../types"
import { getPropName } from "../shared/get-prop-name"

/**
 * Generate a Default Component JSX
 * Default components are generated from default variants and render direct children only
 * Default components do NOT have grandchildren - those are handled by inline-components generators
 * This generates JSX for a default component node (child of parent component)
 */
export function generateDefaultComponent(
  node: JSONTreeNode,
  component: ComponentToExport,
  propValuesMap: Map<string, string>,
): string {
  const propsName = getPropName(
    node.dataBinding.path,
    propValuesMap,
    component.name,
  )
  const propsVarName = `${propsName}Props`

  // If node has no children, return self-closing tag
  if (!Array.isArray(node.children) || node.children.length === 0) {
    return `\n        <${node.name} {...${propsVarName}} />`
  }

  // Generate JSX with children
  let content = `\n        <${node.name} {...${propsVarName}}>`

  for (const child of node.children) {
    const childPropsName = getPropName(
      child.dataBinding.path,
      propValuesMap,
      component.name,
    )
    const childPropsVarName = `${childPropsName}Props`
    content += `\n          <${child.name} {...${childPropsVarName}} />`
  }

  content += `\n        </${node.name}>`
  return content
}

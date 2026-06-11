import { ComponentToExport, JSONTreeNode } from "../../../types"

/**
 * Generates the interface entries for a component's children props.
 *
 * Every node in the tree becomes an optional prop on the component interface,
 * named by the component's prop name map and typed by the node's interface
 * name. Slots accept null to suppress rendering. Names are deduplicated, so a
 * node only appears once.
 */
export function generateChildrenProps(
  component: ComponentToExport,
  propNames: Map<string, string>,
): string {
  let content = ""
  const added = new Set<string>()

  function traverse(node: JSONTreeNode) {
    const propName = propNames.get(node.dataBinding.path)
    if (propName && !added.has(propName)) {
      content += `${propName}?: ${node.dataBinding.interfaceName} | null\n`
      added.add(propName)
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }

  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach(traverse)
  }

  return content
}

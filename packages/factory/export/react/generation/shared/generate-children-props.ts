import { getSubtreeBoundaryPropNames, joinWithSubtreeBreaks } from "./get-subtree-boundaries"

import type { ComponentToExport, JSONTreeNode } from "../../../types"

/**
 * Generates the interface entries for a component's children props.
 *
 * Every node in the tree becomes an optional prop on the component interface,
 * named by the component's prop name map and typed by the node's interface
 * name. Slots accept null to suppress rendering. Names are deduplicated, so a
 * node only appears once.
 *
 * A blank line opens each top-level subtree, so the interface breaks at the same
 * places as the signature, the `sdn` block, and the declaration list.
 */
export function generateChildrenProps(
  component: ComponentToExport,
  propNames: Map<string, string>,
): string {
  const entries: Array<{ name: string; line: string }> = []
  const added = new Set<string>()

  function traverse(node: JSONTreeNode) {
    const propName = propNames.get(node.dataBinding.path)

    if (propName && !added.has(propName)) {
      entries.push({
        name: propName,
        line: `${propName}?: ${node.dataBinding.interfaceName} | null`,
      })
      added.add(propName)
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }

  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach(traverse)
  }

  if (entries.length === 0) return ""

  const boundaries = getSubtreeBoundaryPropNames(component, propNames)

  return joinWithSubtreeBreaks(entries, boundaries) + "\n"
}

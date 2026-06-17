import { JSONTreeNode } from "../../../types"
import { camelCase } from "../../utils/case-utils"

/**
 * Assigns a prop name to every node under the given roots.
 *
 * Numbering is global and depth-first across the collected nodes, deduplicated
 * per base name. This is the single source for prop names, so a component and
 * its consumers stay in sync without re-deriving names from generated strings.
 *
 * The result is keyed by node id, which is unique within a component tree.
 */
export function assignPropNames(
  rootChildren: JSONTreeNode[],
): Map<string, string> {
  const allNodes: JSONTreeNode[] = []

  function collect(node: JSONTreeNode) {
    allNodes.push(node)
    if (Array.isArray(node.children)) {
      node.children.forEach(collect)
    }
  }

  rootChildren.forEach(collect)

  const baseNameCounts = new Map<string, number>()
  const nodeIdToPropName = new Map<string, string>()

  allNodes.forEach((node) => {
    const baseName = camelCase(node.name).replace(/\d+$/, "")
    const count = (baseNameCounts.get(baseName) ?? 0) + 1
    baseNameCounts.set(baseName, count)
    nodeIdToPropName.set(
      node.nodeId,
      count === 1 ? baseName : `${baseName}${count}`,
    )
  })

  return nodeIdToPropName
}

import { EntryNode, Workspace, parseNodeTemplate } from "../../types"

function resolveCatalogId(
  node: EntryNode,
  workspace: Workspace,
  visited: Set<string>,
): string | null {
  if (visited.has(node.id)) return null
  visited.add(node.id)

  const parsed = parseNodeTemplate(node.template)
  if (!parsed) return null
  if (parsed.kind === "catalog") return parsed.componentId

  const nodes = workspace.nodes
  if (!nodes) return null

  const parentNode = nodes[parsed.nodeId]
  if (!parentNode) return null
  return resolveCatalogId(parentNode, workspace, visited)
}

export function getNodeCatalogId(
  node: EntryNode,
  workspace: Workspace,
): string | null {
  return resolveCatalogId(node, workspace, new Set<string>())
}

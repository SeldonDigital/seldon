import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { isVariantNode } from "@seldon/core/workspace/helpers/nodes/is-variant-node"
import { parseNodeTemplate } from "@seldon/core/workspace/model/template-ref"
import type { EntryNode, Workspace } from "@seldon/core/workspace/types"

export function getWorkspaceNodeList(workspace: Workspace): EntryNode[] {
  return Object.values(workspace.nodes)
}

export function getTemplateSourceNodeId(node: EntryNode): string | null {
  const parsed = parseNodeTemplate(node.template)
  if (parsed?.kind === "node") {
    return parsed.nodeId
  }
  return null
}

/**
 * Follows `node:` template references until reaching a default or variant node.
 *
 * A variant board clones the default tree, so its child instances template onto
 * the default tree's child instances, which template onto variants in turn. The
 * single-hop {@link getTemplateSourceNodeId} stops at the intermediate instance,
 * so naming helpers must walk the chain to the underlying variant.
 *
 * @returns The id of the source variant node, or null when the chain does not
 * resolve to a variant or contains a cycle or dangling reference.
 */
export function resolveSourceVariantId(
  node: EntryNode,
  workspace: Workspace,
): string | null {
  const seen = new Set<string>()
  let current: EntryNode | undefined = node

  while (current) {
    const parsed = parseNodeTemplate(current.template)
    if (parsed?.kind !== "node") return null
    if (seen.has(parsed.nodeId)) return null
    seen.add(parsed.nodeId)

    const next = workspace.nodes[parsed.nodeId]
    if (!next) return null
    if (isVariantNode(next)) return parsed.nodeId
    current = next
  }

  return null
}

export function getBoardForNode(workspace: Workspace, nodeId: string) {
  return getBoardByNodeId(workspace, nodeId)
}

export function getInstanceClassHash(nodeId: string): string {
  const nodeIdParts = nodeId.split("-")
  const hashPart = nodeIdParts[nodeIdParts.length - 1] || ""
  return hashPart
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 4)
    .padEnd(4, "0")
}

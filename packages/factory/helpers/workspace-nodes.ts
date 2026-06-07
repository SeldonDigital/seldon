import type { EntryNode, Workspace } from "@seldon/core/workspace/types"
import { parseNodeTemplate } from "@seldon/core/workspace/model/template-ref"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"

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

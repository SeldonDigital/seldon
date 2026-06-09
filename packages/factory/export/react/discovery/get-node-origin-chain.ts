import { Workspace } from "@seldon/core"
import { getNodeById } from "@seldon/core/workspace/helpers/nodes/get-node-by-id"
import type { EntryNode } from "@seldon/core/workspace/types"

import { getTemplateSourceNodeId } from "../../../helpers/workspace-nodes"

export const getNodeOriginChain = (
  node: EntryNode,
  workspace: Workspace,
): EntryNode[] => {
  const nodes = [node]
  let current: EntryNode = node

  while (true) {
    const sourceId = getTemplateSourceNodeId(current)
    if (!sourceId) break
    current = getNodeById(sourceId, workspace)
    nodes.push(current)
  }

  return nodes
}

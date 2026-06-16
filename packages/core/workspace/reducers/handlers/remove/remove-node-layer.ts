import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { getWorkspaceNodes } from "../../../helpers/general/get-workspace-nodes"
import { isEntryNodeForRules } from "../../../helpers/rules/rules-node-subject"
import { readNodeLayerArray } from "../shared/node-layers"

/**
 * Removes the paint layer at `index` from a node's `background` / `shadow`
 * stack and writes the shortened stack back as an override. Index `0` is
 * the bottom base layer and cannot be removed. No-ops when the node is missing,
 * the index is `0`, or the index is out of range.
 */
export function removeNodeLayer(
  payload: ExtractPayload<"remove_node_layer">,
  workspace: Workspace,
): Workspace {
  const node = getWorkspaceNodes(workspace)[payload.nodeId]
  if (!node || !isEntryNodeForRules(node)) return workspace

  const layers = readNodeLayerArray(
    node,
    payload.nodeId,
    payload.property,
    workspace,
  )
  if (payload.index < 1 || payload.index >= layers.length) return workspace
  layers.splice(payload.index, 1)

  return produce(workspace, (draft) => {
    const draftNode = getWorkspaceNodes(draft)[payload.nodeId]
    if (!draftNode) return
    ;(draftNode.overrides as Record<string, unknown>)[payload.property] = layers
  })
}

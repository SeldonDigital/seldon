import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { getWorkspaceNodes } from "../../../helpers/general/get-workspace-nodes"
import { isEntryNodeForRules } from "../../../helpers/rules/rules-node-subject"
import { readNodeLayerArray } from "../shared/node-layers"

/**
 * Moves the paint layer at `fromIndex` to `toIndex` within a node's
 * `background` / `shadow` stack and writes the reordered stack back as an
 * override. Whichever layer ends at index `0` becomes the base. No-ops when
 * the node is missing, either index is out of range, or the indices match.
 */
export function reorderNodeLayer(
  payload: ExtractPayload<"reorder_node_layer">,
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

  const { fromIndex, toIndex } = payload
  if (fromIndex === toIndex) return workspace
  if (fromIndex < 0 || fromIndex >= layers.length) return workspace
  if (toIndex < 0 || toIndex >= layers.length) return workspace

  const [moved] = layers.splice(fromIndex, 1)
  layers.splice(toIndex, 0, moved)

  return produce(workspace, (draft) => {
    const draftNode = getWorkspaceNodes(draft)[payload.nodeId]
    if (!draftNode) return
    ;(draftNode.overrides as Record<string, unknown>)[payload.property] = layers
  })
}

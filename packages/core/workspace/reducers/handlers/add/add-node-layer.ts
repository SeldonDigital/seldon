import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { getWorkspaceNodes } from "../../../helpers/general/get-workspace-nodes"
import { isEntryNodeForRules } from "../../../helpers/rules/rules-node-subject"
import { readNodeLayerArray } from "../shared/node-layers"

/**
 * Appends one paint layer to a node's `background` / `shadow` stack. The new
 * layer lands at the highest index, which renders on top. When a
 * `seed` is given, the layer starts with those facets, otherwise it is an empty
 * bag so inherited values still show through. The full stack is written back as
 * an override so the array carries the new length. No-ops when the node is
 * missing or cannot take overrides.
 */
export function addNodeLayer(
  payload: ExtractPayload<"add_node_layer">,
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
  layers.push(payload.seed ? { ...payload.seed } : {})

  return produce(workspace, (draft) => {
    const draftNode = getWorkspaceNodes(draft)[payload.nodeId]
    if (!draftNode) return
    ;(draftNode.overrides as Record<string, unknown>)[payload.property] = layers
  })
}

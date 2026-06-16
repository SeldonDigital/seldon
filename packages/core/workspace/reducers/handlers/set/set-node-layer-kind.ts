import { produce } from "immer"

import { ExtractPayload, Workspace } from "../../../../index"
import { backgroundLayerForKind } from "../../../../properties/values/appearance/background/background-seeds"
import { getWorkspaceNodes } from "../../../helpers/general/get-workspace-nodes"
import { isEntryNodeForRules } from "../../../helpers/rules/rules-node-subject"
import { readNodeLayerArray } from "../shared/node-layers"

/**
 * Retypes one paint-layer slot to a new `kind`, replacing the slot with that
 * kind's seed facets. The slot is fully replaced so facets from the previous
 * kind do not linger. The whole stack is written back as an override. No-ops
 * when the node is missing, cannot take overrides, or the kind has no seed.
 */
export function setNodeLayerKind(
  payload: ExtractPayload<"set_node_layer_kind">,
  workspace: Workspace,
): Workspace {
  const node = getWorkspaceNodes(workspace)[payload.nodeId]
  if (!node || !isEntryNodeForRules(node)) return workspace

  const seed = backgroundLayerForKind(payload.kind)
  if (!seed) return workspace

  const layerIndex = payload.layerIndex ?? 0
  const layers = readNodeLayerArray(
    node,
    payload.nodeId,
    payload.property,
    workspace,
  )
  while (layers.length <= layerIndex) layers.push({})
  layers[layerIndex] = { ...seed }

  return produce(workspace, (draft) => {
    const draftNode = getWorkspaceNodes(draft)[payload.nodeId]
    if (!draftNode) return
    ;(draftNode.overrides as Record<string, unknown>)[payload.property] = layers
  })
}

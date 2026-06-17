import { ErrorMessages } from "../../../constants"
import { getBoardByNodeId } from "../../../helpers/components/get-board-by-node-id"
import { getVariantById } from "../../../helpers/general/get-variant-by-id"
import { isUserVariant } from "../../../helpers/general/is-user-variant"
import { isVariantNode } from "../../../helpers/nodes/is-variant-node"
import type { InstanceId, VariantId, Workspace } from "../../../types"

export const variantValidators = {
  labelIsUnique: (
    workspace: Workspace,
    { nodeId, label }: { nodeId: VariantId | InstanceId; label: string },
  ) => {
    const variant = workspace.nodes[nodeId]
    if (!variant) {
      throw new Error(ErrorMessages.nodeNotFound(nodeId))
    }
    // Resolve the owning container directly. A sandbox variant's component id is
    // `sandbox`, which is not a board key, so it lives in `playgrounds` instead.
    const board = getBoardByNodeId(workspace, nodeId)
    if (!board) {
      return
    }
    const rootVariantIds = board.variants.map((ref) => ref.id)
    const isLabelTaken = rootVariantIds.some((rowId) => {
      const row = getVariantById(rowId as VariantId, workspace)
      return isUserVariant(row) && row.label === label && row.id !== nodeId
    })

    if (isLabelTaken) {
      throw new Error(ErrorMessages.variantLabelNotUnique(label))
    }
  },
  notToDefaultPosition: (
    workspace: Workspace,
    id: VariantId | InstanceId,
    index: number,
  ) => {
    const node = workspace.nodes[id]
    if (!node) {
      throw new Error(ErrorMessages.nodeNotFound(id))
    }
    if (isVariantNode(node) && index === 0) {
      throw new Error(ErrorMessages.cannotMoveToDefaultPosition())
    }
  },
}

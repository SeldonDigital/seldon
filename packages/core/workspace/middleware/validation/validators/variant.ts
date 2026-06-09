import { ErrorMessages } from "../../../constants"
import { getVariantById } from "../../../helpers/general/get-variant-by-id"
import { isUserVariant } from "../../../helpers/general/is-user-variant"
import { isVariantNode } from "../../../helpers/nodes/is-variant-node"
import type { InstanceId, VariantId, Workspace } from "../../../types"
import { check } from "../check"
import { getNodeComponentId } from "../node-component-id"

export const variantValidators = {
  labelIsUnique: (
    workspace: Workspace,
    { nodeId, label }: { nodeId: VariantId | InstanceId; label: string },
  ) => {
    const variant = workspace.nodes[nodeId]
    if (!variant) {
      throw new Error(ErrorMessages.nodeNotFound(nodeId))
    }
    const component = getNodeComponentId(variant, workspace)
    const board = workspace.boards[component]
    if (!board) {
      throw new Error(ErrorMessages.componentNotFound(component))
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

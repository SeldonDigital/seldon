import { produce } from "immer"
import type { ExtractPayload, Workspace } from "../../../../index"
import { getComponentVariantRootIds } from "../../../helpers/components/get-component-variant-root-ids"

export function reorderVariantInBoard(
  payload: ExtractPayload<"reorder_variant_in_board">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    const board = draft.components[payload.componentKey]
    if (!board?.variants?.length) return

    const roots = getComponentVariantRootIds(board)
    const oldIdx = roots.indexOf(payload.variantRootId)
    if (oldIdx < 0) return

    if (oldIdx === 0 && payload.newIndex !== 0) return
    if (payload.newIndex === 0 && oldIdx !== 0) return

    const len = board.variants.length
    const newIndex = Math.max(0, Math.min(payload.newIndex, len - 1))
    if (oldIdx === newIndex) return

    const [removed] = board.variants.splice(oldIdx, 1)
    board.variants.splice(newIndex, 0, removed)
  })
}

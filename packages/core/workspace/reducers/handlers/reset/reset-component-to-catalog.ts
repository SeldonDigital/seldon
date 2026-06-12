import { ExtractPayload, Workspace } from "../../../../index"
import { isComponentBoard } from "../../../model/components"
import type { VariantId } from "../../../types"
import { removeVariant } from "../remove/remove-variant"
import { resetBoardEditorData } from "./reset-board-editor-data"
import { resetBoardIntent } from "./reset-board-intent"
import { resetBoardLabel } from "./reset-board-label"
import { resetBoardTags } from "./reset-board-tags"
import { resetDefaultVariantToCatalog } from "./reset-default-variant-to-catalog"

/**
 * Resets an entire component board to its catalog state. Removes user variants,
 * rebuilds the default variant from the catalog schema, and resets board
 * metadata to catalog defaults. The first entry in `variants` is the default.
 */
export function resetComponentToCatalog(
  payload: ExtractPayload<"reset_component_to_catalog">,
  workspace: Workspace,
): Workspace {
  const board = workspace.boards[payload.boardKey]
  if (!board || !isComponentBoard(board)) return workspace

  const variantIds = board.variants.map((variant) => variant.id)
  const defaultVariantId = variantIds[0]

  let next = workspace

  for (const variantId of variantIds.slice(1)) {
    next = removeVariant({ variantRootId: variantId as VariantId }, next)
  }

  if (defaultVariantId) {
    next = resetDefaultVariantToCatalog(
      { defaultVariantRootId: defaultVariantId as VariantId },
      next,
    )
  }

  next = resetBoardLabel({ boardKey: payload.boardKey }, next)
  next = resetBoardIntent({ boardKey: payload.boardKey }, next)
  next = resetBoardTags({ boardKey: payload.boardKey }, next)
  next = resetBoardEditorData({ boardKey: payload.boardKey }, next)

  return next
}

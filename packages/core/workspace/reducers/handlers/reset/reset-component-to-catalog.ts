import { produce } from "immer"

import type { ComponentId } from "../../../../components/constants"
import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import { componentBoardDefaultNodeId } from "../../../helpers/components/entry-node-ids"
import { collectExternalVariantUsage } from "../../../helpers/general/collect-external-variant-usage"
import { applyResetSchemaVariantsToCatalog } from "../../../helpers/nodes/apply-reset-schema-variants-to-catalog"
import { isComponentBoard } from "../../../model/components"
import type { VariantId } from "../../../types"
import { ensureComponentBoards } from "../add/add-component"
import { resetBoardEditorData } from "./reset-board-editor-data"
import { resetBoardIntent } from "./reset-board-intent"
import { resetBoardLabel } from "./reset-board-label"
import { resetBoardTags } from "./reset-board-tags"
import { resetDefaultVariantToCatalog } from "./reset-default-variant-to-catalog"

/**
 * Resets an entire component board to its catalog state. Rebuilds the default
 * variant from the catalog schema, restores every catalog schema variant under
 * its deterministic id, removes user variants, and resets board metadata. The
 * first entry in `variants` is the default.
 *
 * Refuses the reset when a variant it would drop is still referenced by another
 * board, so the rebuild never leaves a dangling reference. The validation
 * pipeline raises this as an error for dispatched actions; the reducer repeats
 * the check so direct callers cannot bypass it.
 */
export function resetComponentToCatalog(
  payload: ExtractPayload<"reset_component_to_catalog">,
  workspace: Workspace,
): Workspace {
  const board = workspace.boards[payload.boardKey]
  if (!board || !isComponentBoard(board)) return workspace

  if (collectExternalVariantUsage(payload.boardKey, workspace).length > 0) {
    return workspace
  }

  const defaultVariantId = componentBoardDefaultNodeId(payload.boardKey)

  let next = workspace

  // A prior restricted build may have skipped descendant boards this catalog
  // needs (for example a variant's `SELECT` or `OPTION`). Backfill them before
  // rebuilding so the schema-variant pass finds every board it registers.
  if (rules.mutations.create.board.allowed) {
    next = produce(next, (draft) => {
      ensureComponentBoards(draft, board.catalogId as ComponentId)
    })
  }

  next = resetDefaultVariantToCatalog(
    { defaultVariantRootId: defaultVariantId as VariantId },
    next,
  )
  next = applyResetSchemaVariantsToCatalog(next, payload.boardKey)

  next = resetBoardLabel({ boardKey: payload.boardKey }, next)
  next = resetBoardIntent({ boardKey: payload.boardKey }, next)
  next = resetBoardTags({ boardKey: payload.boardKey }, next)
  next = resetBoardEditorData({ boardKey: payload.boardKey }, next)

  return next
}

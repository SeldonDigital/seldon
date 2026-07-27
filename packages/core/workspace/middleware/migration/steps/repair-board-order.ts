import { boardOrderService } from "../../../services/components/board-order.service"

import type { Workspace } from "../../../model/workspace"

/**
 * Realigns the stored board order on every load.
 *
 * Board order is derived: `realignBoardOrder` sorts boards by level, then by how
 * many other same-level boards each one composes, then by label. Mutations
 * already realign, but a workspace loaded from disk keeps whatever order was
 * stored when it was saved. Running the realign as an idempotent repair makes an
 * opened file reflect the current ordering logic without waiting for a mutation.
 */
export function repairBoardOrder(workspace: Workspace): Workspace {
  return boardOrderService.realignBoardOrder(workspace)
}

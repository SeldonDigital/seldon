import {
  nodeTraversalService,
  resolveInstanceMoveTarget,
} from "../../../services"
import { ExtractPayload, Workspace } from "../../../types"
import { reorderInstanceInParent } from "../reorder/reorder-instance-in-parent"
import { moveInstance } from "./move-instance"

/**
 * Moves an instance one slot forward/backward, or to the front/back, through the
 * document-order list of viable insertion slots. Delegates to the same handlers
 * the drag path uses: `reorderInstanceInParent` when the parent is unchanged and
 * `moveInstance` when it crosses into another container.
 */
export function moveInstanceDirectional(
  payload: ExtractPayload<"move_instance_directional">,
  workspace: Workspace,
): Workspace {
  const { instanceId, direction } = payload
  const target = resolveInstanceMoveTarget(workspace, instanceId, direction)
  if (!target) return workspace

  const currentParent = nodeTraversalService.findParentNode(
    instanceId,
    workspace,
  )

  if (currentParent && currentParent.id === target.parentId) {
    return reorderInstanceInParent(
      { instanceId, newIndex: target.index },
      workspace,
    )
  }

  return moveInstance(
    {
      instanceId,
      target: { parentId: target.parentId, index: target.index },
    },
    workspace,
  )
}

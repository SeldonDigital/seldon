import type { Board, Instance, Variant } from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import {
  NORMAL_STATE,
  type NodeState,
} from "@seldon/core/workspace/model/node-state"
import { nodeRelationshipService } from "@seldon/core/workspace/services"
import { useBoardStateStore } from "@app/canvas/hooks/use-board-state-store"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useWorkspace } from "./use-workspace"

/** Shown when an instance edit is attempted while a non-Normal state is active. */
export const INSTANCE_STATE_EDIT_MESSAGE =
  "Instances use component states. To make changes, select the original or source component and edit the state there."

/**
 * Resolves the active interaction state for a node's board. Boards and missing
 * nodes resolve to Normal. Used by the canvas edit router and the properties
 * sidebar to gate instance edits in a non-Normal state.
 */
export function useNodeActiveState(
  node: Variant | Instance | Board | null | undefined,
): NodeState {
  const { workspace } = useWorkspace()
  const activeStates = useBoardStateStore((store) => store.activeStates)

  if (!node || isBoard(node)) return NORMAL_STATE
  const board = nodeRelationshipService.findBoardForNode(node, workspace)
  const boardKey = board ? getComponentKey(board) : undefined
  return boardKey ? (activeStates[boardKey] ?? NORMAL_STATE) : NORMAL_STATE
}

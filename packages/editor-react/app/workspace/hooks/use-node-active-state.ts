import type { Board, Instance, Variant, Workspace } from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import {
  NORMAL_STATE,
  type NodeState,
} from "@seldon/core/workspace/model/node-state"
import { nodeRelationshipService } from "@seldon/core/workspace/services"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useBoardStateStore } from "@app/canvas/hooks/use-board-state-store"
import { getCurrentWorkspace } from "./use-history"
import { usePreviewStore } from "./use-preview-store"

/** Shown when an instance edit is attempted while a non-Normal state is active. */
export const INSTANCE_STATE_EDIT_MESSAGE =
  "Instances use component states. To make changes, select the original or source component and edit the state there."

/**
 * Preview-aware workspace snapshot, read without subscribing. A node's board
 * membership does not change on property edits, so resolving the active state
 * against the snapshot stays correct while letting consumers skip re-renders on
 * every edit.
 */
function getActiveStateWorkspace(): Workspace {
  return usePreviewStore.getState().preview ?? getCurrentWorkspace()
}

/**
 * Resolves the active interaction state for a node's board from the current
 * workspace snapshot and the active-state store. Boards and missing nodes
 * resolve to Normal. Use inside command and action callbacks that need the live
 * active state at call time without subscribing.
 */
export function getActiveStateForNode(
  node: Variant | Instance | Board | null | undefined,
): NodeState {
  if (!node || isBoard(node)) return NORMAL_STATE
  const board = nodeRelationshipService.findBoardForNode(
    node,
    getActiveStateWorkspace(),
  )
  const boardKey = board ? getComponentKey(board) : undefined
  if (!boardKey) return NORMAL_STATE
  return useBoardStateStore.getState().activeStates[boardKey] ?? NORMAL_STATE
}

/**
 * Resolves the active interaction state for a node's board. Boards and missing
 * nodes resolve to Normal. Used by the canvas edit router and the properties
 * sidebar to gate instance edits in a non-Normal state.
 *
 * Subscribes to the active-state store but reads the workspace from a snapshot,
 * so a property edit alone does not re-render the consumer. The active state
 * still updates reactively when the user switches a board's state.
 */
export function useNodeActiveState(
  node: Variant | Instance | Board | null | undefined,
): NodeState {
  const activeStates = useBoardStateStore((store) => store.activeStates)

  if (!node || isBoard(node)) return NORMAL_STATE
  const board = nodeRelationshipService.findBoardForNode(
    node,
    getActiveStateWorkspace(),
  )
  const boardKey = board ? getComponentKey(board) : undefined
  return boardKey ? (activeStates[boardKey] ?? NORMAL_STATE) : NORMAL_STATE
}

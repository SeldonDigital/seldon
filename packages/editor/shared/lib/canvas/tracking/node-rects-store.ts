import { rectsEqual } from "../overlay/measure"
import { createStore } from "../store/observable"

import type { NodeRect } from "../overlay/geometry"

export interface NodeRectsState {
  /**
   * Every tracked node's rect, held in one map that is written in place.
   *
   * A snapshot per write would copy the whole map on every measurement, and a pan
   * measures hundreds of times a second, so the cost would scale with how many nodes
   * have ever been tracked. `version` is what changes instead, so readers know to read
   * the map again while each write stays flat.
   */
  rects: Map<string, NodeRect | null>
  version: number
}

export const nodeRectsStore = createStore<NodeRectsState>({
  rects: new Map(),
  version: 0,
})

/**
 * Records where a node is, and tells readers only when that has actually moved.
 *
 * A measurement pass re-reads every node it tracks, and most of them sit exactly where
 * they were, so a write that says nothing new is dropped rather than re-rendering
 * everything that reads a rect.
 */
export function updateNodeRect(nodeId: string, rect: NodeRect | null): void {
  const { rects, version } = nodeRectsStore.getState()

  if (rectsEqual(rects.get(nodeId) ?? null, rect)) return

  rects.set(nodeId, rect)
  nodeRectsStore.setState({ version: version + 1 })
}

/**
 * Forgets every node outside the given set.
 *
 * Called when the tracked set changes, which is how switching boards drops the board
 * that was left. Without it the map would hold every node visited in the session, and
 * measurement would keep paying for boards nobody is looking at.
 */
export function removeNodeRectsExcept(nodeIds: Iterable<string>): void {
  const { rects, version } = nodeRectsStore.getState()
  const keep = new Set(nodeIds)
  let removed = false

  for (const nodeId of rects.keys()) {
    if (keep.has(nodeId)) continue

    rects.delete(nodeId)
    removed = true
  }

  if (!removed) return

  nodeRectsStore.setState({ version: version + 1 })
}

export function getNodeRect(nodeId: string): NodeRect | null {
  return nodeRectsStore.getState().rects.get(nodeId) ?? null
}

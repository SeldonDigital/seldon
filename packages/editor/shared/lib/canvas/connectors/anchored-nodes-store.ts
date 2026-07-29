import { createStore } from "../store/observable"

export interface AnchoredNodesState {
  /**
   * Every node a drawn connector meets.
   *
   * Held so an overlay that draws a box per node can color the ones a connector points
   * at without knowing anything about refs. The ref overlay writes it and clears it when
   * it stops drawing, and nothing else reads it while it is empty.
   */
  nodeIds: Set<string>
}

export const anchoredNodesStore = createStore<AnchoredNodesState>({ nodeIds: new Set() })

/**
 * Records the nodes connectors are anchored to, and tells readers only when that has
 * actually changed.
 *
 * The overlay lays its connectors out again on every frame of a pan while the nodes they
 * point at stay the same, so a set that says nothing new is dropped rather than
 * re-rendering every box on screen.
 */
export function setAnchoredNodes(nodeIds: Iterable<string>): void {
  const next = new Set(nodeIds)

  if (holdsSame(anchoredNodesStore.getState().nodeIds, next)) return

  anchoredNodesStore.setState({ nodeIds: next })
}

function holdsSame(current: Set<string>, next: Set<string>): boolean {
  if (current.size !== next.size) return false

  for (const nodeId of current) {
    if (!next.has(nodeId)) return false
  }

  return true
}

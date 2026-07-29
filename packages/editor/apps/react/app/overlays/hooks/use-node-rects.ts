import { nodeRectsStore } from "@seldon/editor/lib/canvas/tracking/node-rects-store"

import { useSharedStore } from "../../canvas/hooks/use-shared-store"

import type { NodeRect } from "@seldon/editor/lib/canvas/overlay/geometry"

export type { NodeRect }

/**
 * React binding for the tracked rectangle of a single node, relative to the
 * canvas, or null when the node is not currently tracked.
 */
export function useNodeRect(nodeId: string): NodeRect | null {
  return useSharedStore(nodeRectsStore, (state) => state.rects.get(nodeId) ?? null)
}

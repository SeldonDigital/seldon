import { useShallow } from "zustand/react/shallow"
import { NodeRect, useNodeRectsStore } from "./use-node-rects-store"

/**
 * Hook that retrieves the tracked rectangle for a specific node.
 * Returns the node's position and size relative to the canvas, or null if not tracked.
 *
 * @param nodeId - The ID of the node to get the rectangle for
 * @returns The node's rectangle or null if not found
 */
export function useNodeRect(nodeId: string): NodeRect | null {
  return useNodeRectsStore(useShallow((s) => s.rects[nodeId]))
}

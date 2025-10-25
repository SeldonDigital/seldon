import { useShallow } from "zustand/react/shallow"
import { NodeRect, useNodeRectsStore } from "./use-node-rects-store"

export function useNodeRect(nodeId: string): NodeRect | null {
  return useNodeRectsStore(useShallow((s) => s.rects[nodeId]))
}

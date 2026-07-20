import { create } from "zustand"

import { InstanceId, VariantId } from "@seldon/core/index"

export type ClipboardMode = "copy" | "cut"

type ObjectClipboardState = {
  nodeId: VariantId | InstanceId | null
  mode: ClipboardMode | null
  setClipboard: (nodeId: VariantId | InstanceId, mode: ClipboardMode) => void
  clearClipboard: () => void
}

/**
 * Holds the object currently copied or cut from the objects sidebar. Stores the
 * source node id only; the node is re-read from the workspace at paste time so a
 * deleted source resolves to an error instead of a stale snapshot.
 */
export const useObjectClipboard = create<ObjectClipboardState>()((set) => ({
  nodeId: null,
  mode: null,
  setClipboard: (nodeId, mode) => set({ nodeId, mode }),
  clearClipboard: () => set({ nodeId: null, mode: null }),
}))

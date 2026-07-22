import { create } from "zustand"

/**
 * Holds the board key that should enter inline rename as soon as its row mounts.
 * A create command sets it, and the matching board row reads it once, opens its
 * name editor, then clears it. Only one board can be pending at a time.
 */
interface PendingRenameStore {
  pendingBoardKey: string | null
  requestRename: (boardKey: string) => void
  clear: () => void
}

export const usePendingRenameStore = create<PendingRenameStore>((set) => ({
  pendingBoardKey: null,
  requestRename: (boardKey: string) => set({ pendingBoardKey: boardKey }),
  clear: () => set({ pendingBoardKey: null }),
}))

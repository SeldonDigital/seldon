import { create } from "zustand"

import type { ComponentDragPayload } from "@seldon/editor/lib/workspace/component-drag"

interface ComponentDragSessionState {
  payload: ComponentDragPayload | null
  begin: (payload: ComponentDragPayload) => void
  clear: () => void
}

const useStore = create<ComponentDragSessionState>((set) => ({
  payload: null,
  begin: (payload) => set({ payload }),
  clear: () => set({ payload: null }),
}))

export function useComponentDragSession() {
  return useStore()
}

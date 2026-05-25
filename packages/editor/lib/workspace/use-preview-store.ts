import { create } from "zustand"
import { Workspace } from "@seldon/core"

interface PreviewStore {
  preview: Workspace | null
  original: Workspace | null

  // Actions
  initialize: (workspace: Workspace) => void
  update: (workspace: Workspace) => void
  reset: () => void
}

export const usePreviewStore = create<PreviewStore>((set) => ({
  preview: null,
  original: null,

  initialize: (workspace: Workspace) => {
    set({
      original: workspace,
      preview: workspace,
    })
  },

  update: (workspace: Workspace) => {
    set({
      preview: workspace,
    })
  },

  reset: () => {
    set({
      preview: null,
      original: null,
    })
  },
}))

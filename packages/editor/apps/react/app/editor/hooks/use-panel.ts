import { create } from "zustand"
import { persist } from "zustand/middleware"

import { useTool } from "./use-tool"

import type { ComponentLevel } from "@seldon/core/components/constants"

export type PanelType =
  | "add-board"
  | "create-component"
  | "export-components"
  | "add-theme"
  | "add-font-collection"
  | "add-icon-set"
  | "image-upload"
  | null

type OpenPanelArgs =
  | [activePanel: "add-board", options?: { level?: ComponentLevel }]
  | [activePanel: "create-component", options?: undefined]
  | [activePanel: "export-components", options?: undefined]
  | [activePanel: "add-theme", options?: undefined]
  | [activePanel: "add-font-collection", options?: undefined]
  | [activePanel: "add-icon-set", options?: undefined]
  | [activePanel: "image-upload", options?: undefined]
  | [activePanel: null, options?: undefined]

type PanelState = {
  // The single exclusive slot: opening one dialog closes any other. Palettes are
  // not tracked here, so a palette stays open while a dialog is used.
  activePanel: PanelType
  openPanel: (...args: OpenPanelArgs) => void
  closePanel: () => void

  // Palette visibility, each independent of `activePanel` and of one another, so a
  // palette coexists with a dialog and with the other palettes. The Hari chat is the
  // first; other palettes keep their own flags where they already live.
  aiChatOpen: boolean
  openAiChat: () => void
  closeAiChat: () => void
  componentPaletteOpen: boolean
  openComponentPalette: () => void
  closeComponentPalette: () => void

  // The active dialog's level is optional so a dialog without it
  // omits them. Optional members come last to keep required members first.
  dialogLevel?: ComponentLevel
}

const useStore = create<PanelState>()(
  persist(
    (set) => ({
      activePanel: null,
      dialogLevel: undefined,
      openPanel: (...args: OpenPanelArgs) => {
        switch (args[0]) {
          case "add-board":
            set({
              activePanel: args[0],
              dialogLevel: args[1]?.level,
            })
            break
          case "create-component":
          case "export-components":
          case "add-theme":
          case "add-font-collection":
          case "add-icon-set":
          case "image-upload":
            set({
              activePanel: args[0],
              dialogLevel: undefined,
            })
            break

          default:
            set({ activePanel: null, dialogLevel: undefined })
        }
      },
      closePanel: () => set({ activePanel: null, dialogLevel: undefined }),

      aiChatOpen: false,
      openAiChat: () => set({ aiChatOpen: true }),
      closeAiChat: () => set({ aiChatOpen: false }),
      componentPaletteOpen: false,
      openComponentPalette: () => set({ componentPaletteOpen: true }),
      closeComponentPalette: () => set({ componentPaletteOpen: false }),
    }),
    {
      name: "editor-panel",
      // Only the palette-visibility flag persists; the exclusive dialog slot must
      // start closed each session, so it stays out of storage.
      partialize: (state) => ({
        aiChatOpen: state.aiChatOpen,
        componentPaletteOpen: state.componentPaletteOpen,
      }),
    },
  ),
)

export function usePanel() {
  const store = useStore()
  const { setActiveTool } = useTool()

  return {
    activePanel: store.activePanel,
    openPanel: store.openPanel,
    closePanel: () => {
      if (store.activePanel !== "image-upload" && store.activePanel !== null) {
        setActiveTool("select")
      }

      store.closePanel()
    },
    dialogLevel: store.activePanel === "add-board" ? store.dialogLevel : undefined,

    aiChatOpen: store.aiChatOpen,
    openAiChat: store.openAiChat,
    closeAiChat: store.closeAiChat,
    componentPaletteOpen: store.componentPaletteOpen,
    openComponentPalette: store.openComponentPalette,
    closeComponentPalette: store.closeComponentPalette,
  }
}

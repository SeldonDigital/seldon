import { create } from "zustand"
import { ComponentLevel } from "@seldon/core/components/constants"
import { Target } from "@lib/workspace/target"
import { useTool } from "./use-tool"

export type PanelType =
  | "add-board"
  | "create-component"
  | "export-components"
  | "add-theme"
  | "add-font-collection"
  | "add-icon-set"
  | "component"
  | "image-upload"
  | "ai-chat"
  | null

type OpenPanelArgs =
  | [activePanel: "add-board", options?: { level?: ComponentLevel }]
  | [activePanel: "create-component", options?: undefined]
  | [activePanel: "export-components", options?: undefined]
  | [activePanel: "add-theme", options?: undefined]
  | [activePanel: "add-font-collection", options?: undefined]
  | [activePanel: "add-icon-set", options?: undefined]
  | [activePanel: "component", options?: Target]
  | [activePanel: "image-upload", options?: undefined]
  | [activePanel: "ai-chat", options?: undefined]
  | [activePanel: null, options?: undefined]

type PanelState = {
  activePanel: PanelType
  target?: Target
  dialogLevel?: ComponentLevel
  openPanel: (...args: OpenPanelArgs) => void
  closePanel: () => void
}

const useStore = create<PanelState>((set) => ({
  activePanel: null,
  target: undefined,
  dialogLevel: undefined,
  openPanel: (...args: OpenPanelArgs) => {
    switch (args[0]) {
      case "component":
        set({ activePanel: args[0], target: args[1], dialogLevel: undefined })
        break
      case "add-board":
        set({
          activePanel: args[0],
          target: undefined,
          dialogLevel: args[1]?.level,
        })
        break
      case "create-component":
      case "export-components":
      case "add-theme":
      case "add-font-collection":
      case "add-icon-set":
      case "image-upload":
      case "ai-chat":
        set({
          activePanel: args[0],
          target: undefined,
          dialogLevel: undefined,
        })
        break

      default:
        set({ activePanel: null, target: undefined, dialogLevel: undefined })
    }
  },
  closePanel: () =>
    set({ activePanel: null, target: undefined, dialogLevel: undefined }),
}))

export function usePanel() {
  const store = useStore()
  const { setActiveTool } = useTool()

  return {
    activePanel: store.activePanel,
    openPanel: store.openPanel,
    closePanel: () => {
      if (
        store.activePanel !== "image-upload" &&
        store.activePanel !== "ai-chat" &&
        store.activePanel !== null
      ) {
        setActiveTool("select")
      }
      store.closePanel()
    },
    target: store.activePanel === "component" ? store.target : undefined,
    dialogLevel:
      store.activePanel === "add-board" ? store.dialogLevel : undefined,
  }
}

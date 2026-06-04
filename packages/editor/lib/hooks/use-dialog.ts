import { create } from "zustand"
import { ComponentLevel } from "@seldon/core/components/constants"
import { Target } from "./use-target"
import { useTool } from "./use-tool"

export type DialogType =
  | "add-board"
  | "add-theme"
  | "add-font-collection"
  | "component"
  | "image-upload"
  | null

type OpenDialogArgs =
  | [activeDialog: "add-board", options?: { level?: ComponentLevel }]
  | [activeDialog: "add-theme", options?: undefined]
  | [activeDialog: "add-font-collection", options?: undefined]
  | [activeDialog: "component", options?: Target]
  | [activeDialog: "image-upload", options?: undefined]
  | [activeDialog: null, options?: undefined]

type DialogState = {
  activeDialog: DialogType
  target?: Target
  dialogLevel?: ComponentLevel
  openDialog: (...args: OpenDialogArgs) => void
  closeDialog: () => void
}

const useStore = create<DialogState>((set) => ({
  activeDialog: null,
  target: undefined,
  dialogLevel: undefined,
  openDialog: (...args: OpenDialogArgs) => {
    switch (args[0]) {
      case "component":
        set({ activeDialog: args[0], target: args[1], dialogLevel: undefined })
        break
      case "add-board":
        set({
          activeDialog: args[0],
          target: undefined,
          dialogLevel: args[1]?.level,
        })
        break
      case "add-theme":
      case "add-font-collection":
      case "image-upload":
        set({ activeDialog: args[0], target: undefined, dialogLevel: undefined })
        break

      default:
        set({ activeDialog: null, target: undefined, dialogLevel: undefined })
    }
  },
  closeDialog: () =>
    set({ activeDialog: null, target: undefined, dialogLevel: undefined }),
}))

export function useDialog() {
  const store = useStore()
  const { setActiveTool } = useTool()

  return {
    activeDialog: store.activeDialog,
    openDialog: store.openDialog,
    closeDialog: () => {
      if (
        store.activeDialog !== "image-upload" &&
        store.activeDialog !== null
      ) {
        setActiveTool("select")
      }
      store.closeDialog()
    },
    target: store.activeDialog === "component" ? store.target : undefined,
    dialogLevel: store.activeDialog === "add-board" ? store.dialogLevel : undefined,
  }
}

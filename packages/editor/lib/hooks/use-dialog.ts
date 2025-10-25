import { create } from "zustand"
import { Target } from "./use-target"
import { useTool } from "./use-tool"

export type DialogType =
  | "sketch"
  | "suggest"
  | "add-board"
  | "component"
  | "image-upload"
  | null

type OpenDialogArgs =
  | [activeDialog: "sketch", target: Target]
  | [activeDialog: "suggest", target: Target]
  | [activeDialog: "add-board", target?: undefined]
  | [activeDialog: "component", target?: Target]
  | [activeDialog: "image-upload", target?: undefined]
  | [activeDialog: null, target?: undefined]

type ActiveDialog =
  | { activeDialog: "sketch"; target: Target }
  | { activeDialog: "suggest"; target: Target }
  | { activeDialog: "add-board"; target?: undefined }
  | { activeDialog: "component"; target?: Target }
  | { activeDialog: "image-upload"; target?: undefined }
  | { activeDialog: null; target?: undefined }

type DialogState = ActiveDialog & {
  openDialog: (...args: OpenDialogArgs) => void
  closeDialog: () => void
}

const useStore = create<DialogState>((set) => ({
  activeDialog: null,
  target: undefined,
  openDialog: (...args: OpenDialogArgs) => {
    switch (args[0]) {
      case "sketch":
        set({ activeDialog: args[0], target: args[1] })
        break
      case "suggest":
        set({ activeDialog: args[0], target: args[1] })
        break
      case "component":
        set({ activeDialog: args[0], target: args[1] })
        break
      case "add-board":
        set({ activeDialog: args[0], target: undefined })
        break
      case "image-upload":
        set({ activeDialog: args[0], target: undefined })
        break

      default:
        set({ activeDialog: null, target: undefined })
    }
  },
  closeDialog: () => set({ activeDialog: null }),
}))

export function useDialog() {
  const { activeDialog, openDialog, closeDialog, target } = useStore()
  const { setActiveTool } = useTool()

  return {
    activeDialog,
    openDialog,
    closeDialog: () => {
      if (activeDialog !== "image-upload") {
        setActiveTool("select")
      }
      closeDialog()
    },
    target,
  }
}

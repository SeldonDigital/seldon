import { create } from "zustand"
import { Target } from "./use-target"
import { useTool } from "./use-tool"

export type DialogType =
  | "add-board"
  | "component"
  | "image-upload"
  | null

type OpenDialogArgs =
  | [activeDialog: "add-board", target?: undefined]
  | [activeDialog: "component", target?: Target]
  | [activeDialog: "image-upload", target?: undefined]
  | [activeDialog: null, target?: undefined]

type ActiveDialog =
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
  const store = useStore()
  const { setActiveTool } = useTool()

  const target =
    store.activeDialog !== null && store.activeDialog === "component"
      ? (
          store.activeDialog as unknown as {
            activeDialog: "component"
            target?: Target
          }
        ).target
      : undefined

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
    target,
  }
}

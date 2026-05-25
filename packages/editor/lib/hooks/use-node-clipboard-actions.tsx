import { useCallback } from "react"
import { useAddToast } from "@components/toaster/use-add-toast"

export function useNodeClipboardActions() {
  const addToast = useAddToast()

  const cutOrCopyNode = useCallback(
    (mode: "cut" | "copy") => {
      addToast(
        mode === "cut"
          ? "Cut/paste is not yet implemented"
          : "Copy/paste is not yet implemented",
      )
    },
    [addToast],
  )

  const pasteNode = useCallback(() => {
    addToast("Cut/copy/paste is not yet implemented")
  }, [addToast])

  return {
    copyNode: () => cutOrCopyNode("copy"),
    cutNode: () => cutOrCopyNode("cut"),
    pasteNode,
  }
}

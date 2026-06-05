import { useRef, useState } from "react"
import { create } from "zustand"
import { ValueType } from "@seldon/core/properties"
import { useImageUpload } from "@lib/api/hooks/use-image-upload"
import { useDialog } from "@lib/hooks/use-dialog"
import { useObjectProperties } from "@lib/workspace/use-object-properties"

interface ImageUploadPanelState {
  property: "source" | "background-image" | null
  setProperty: (property: "source" | "background-image") => void
  reset: () => void
}

const useStore = create<ImageUploadPanelState>((set) => ({
  property: null,
  setProperty: (property) => set({ property }),
  reset: () => set({ property: null }),
}))

export function useImageUploadPanel() {
  const { activeDialog, openDialog, closeDialog } = useDialog()
  const { property, setProperty, reset: resetStore } = useStore()
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setProperties } = useObjectProperties()

  const {
    mutateAsync: upload,
    status,
    error,
    reset: resetUpload,
  } = useImageUpload()

  function show({ property }: { property: "source" | "background-image" }) {
    setProperty(property)
    openDialog("image-upload")
  }

  function close() {
    resetStore()
    closeDialog()
    resetUpload()
    setCurrentFile(null)
  }

  function clear() {
    setCurrentFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function save() {
    if (currentFile) {
      const data = await upload(currentFile)

      if (property === "source") {
        setProperties({
          source: {
            type: ValueType.EXACT,
            value: data.url,
          },
        })
      } else if (property === "background-image") {
        setProperties({
          background: {
            image: {
              type: ValueType.EXACT,
              value: data.url,
            },
          },
        })
      } else {
        throw new Error("Invalid property " + property)
      }

      setCurrentFile(null)
      close()
    }
  }

  return {
    property,
    isOpen: activeDialog === "image-upload",
    currentFile,
    onFileChange: setCurrentFile,
    fileInputRef,
    status,
    error,
    show,
    close,
    clear,
    save,
  }
}

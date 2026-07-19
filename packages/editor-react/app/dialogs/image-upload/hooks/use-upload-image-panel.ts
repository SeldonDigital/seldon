import { useRef, useState } from "react"
import { create } from "zustand"
import { BackgroundKind, ValueType } from "@seldon/core/properties"
import { useImageUpload } from "./use-image-upload"
import { useObjectProperties } from "@app/workspace/hooks/use-object-properties"
import { usePanel } from "@app/editor/hooks/use-panel"

export type ImageUploadTarget = "source" | "background-image"

/**
 * Maps a property key to its image upload target. Covers the top-level `source`
 * attribute and a background `image` facet at any layer index. Returns `null`
 * for keys that carry no image upload, so callers share one definition of
 * "this row sets an image".
 */
export function imageUploadTargetForKey(
  propertyKey: string,
): ImageUploadTarget | null {
  if (propertyKey === "source") return "source"
  if (
    propertyKey === "background.image" ||
    /^background\.\d+\.image$/.test(propertyKey)
  ) {
    return "background-image"
  }
  return null
}

interface ImageUploadPanelState {
  property: ImageUploadTarget | null
  setProperty: (property: ImageUploadTarget) => void
  reset: () => void
}

const useStore = create<ImageUploadPanelState>((set) => ({
  property: null,
  setProperty: (property) => set({ property }),
  reset: () => set({ property: null }),
}))

export function useImageUploadPanel() {
  const { activePanel, openPanel, closePanel } = usePanel()
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

  function show({ property }: { property: ImageUploadTarget }) {
    setProperty(property)
    openPanel("image-upload")
  }

  function close() {
    resetStore()
    closePanel()
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
          source: { type: ValueType.EXACT, value: data.url },
        })
      } else if (property === "background-image") {
        // Type the layer as an image so it renders even when the slot was a
        // different kind, and write the uploaded url onto the base layer.
        setProperties({
          background: [
            {
              kind: { type: ValueType.OPTION, value: BackgroundKind.IMAGE },
              image: { type: ValueType.EXACT, value: data.url },
            },
          ],
        })
      }

      setCurrentFile(null)
      close()
    }
  }

  return {
    property,
    isOpen: activePanel === "image-upload",
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

import { computed, ref } from "vue"
import { storeToRefs } from "pinia"
import { BackgroundKind, ValueType } from "@seldon/core/properties"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { convertBlobToBase64 } from "@seldon/editor/lib/helpers/convert-blob-to-base64"
import type { ImageUploadTarget } from "@seldon/editor/lib/dialogs/image-upload-target"
import { useImageUploadStore } from "./image-upload-store"
import { usePanelStore } from "@app/editor/panel-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import { useSelection } from "@app/workspace/use-selection"

type UploadStatus = "idle" | "pending" | "success" | "error"

/**
 * View-model for the image upload dialog. Owns the picked file and read status,
 * opens and closes the panel, and on save reads the file to a data URL and
 * writes it onto the selection's `source` or `background` image. Vue port of the
 * React `useImageUploadPanel`.
 */
export function useImageUploadPanel() {
  const panel = usePanelStore()
  const { activePanel } = storeToRefs(panel)
  const store = useImageUploadStore()
  const { property } = storeToRefs(store)
  const dispatch = useDispatch()
  const { selectedItem } = useSelection()

  const currentFile = ref<File | null>(null)
  const status = ref<UploadStatus>("idle")

  const isOpen = computed(() => activePanel.value === "image-upload")

  function setProperties(properties: Record<string, unknown>): void {
    const subject = selectedItem.value
    if (!subject) return
    if (isBoard(subject)) {
      dispatch({
        type: "set_component_properties",
        payload: { boardKey: getComponentKey(subject), properties },
      } as never)
      return
    }
    dispatch({
      type: "set_node_properties",
      payload: { nodeId: subject.id, properties },
    } as never)
  }

  function show(target: ImageUploadTarget): void {
    store.setProperty(target)
    panel.openPanel("image-upload")
  }

  function close(): void {
    store.reset()
    panel.closePanel()
    status.value = "idle"
    currentFile.value = null
  }

  function onFileChange(file: File | null): void {
    currentFile.value = file
  }

  async function save(): Promise<void> {
    if (!currentFile.value) return
    status.value = "pending"
    try {
      const url = await convertBlobToBase64(currentFile.value)
      status.value = "success"
      if (property.value === "source") {
        setProperties({ source: { type: ValueType.EXACT, value: url } })
      } else if (property.value === "background-image") {
        // Type the layer as an image so it renders even when the slot was a
        // different kind, and write the uploaded url onto the base layer.
        setProperties({
          background: [
            {
              kind: { type: ValueType.OPTION, value: BackgroundKind.IMAGE },
              image: { type: ValueType.EXACT, value: url },
            },
          ],
        })
      }
      close()
    } catch {
      status.value = "error"
    }
  }

  return {
    isOpen,
    property,
    currentFile,
    status,
    show,
    close,
    onFileChange,
    save,
  }
}

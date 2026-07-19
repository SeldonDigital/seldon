import { defineStore } from "pinia"
import { ref } from "vue"
import { InstanceId, VariantId } from "@seldon/core"

export type ClipboardMode = "copy" | "cut"

/**
 * Holds the object currently copied or cut from the objects sidebar. Stores the
 * source node id only; the node is re-read from the workspace at paste time so a
 * deleted source resolves to an error instead of a stale snapshot. Mirrors the
 * React `use-object-clipboard` store.
 */
export const useObjectClipboardStore = defineStore("object-clipboard", () => {
  const nodeId = ref<VariantId | InstanceId | null>(null)
  const mode = ref<ClipboardMode | null>(null)

  function setClipboard(id: VariantId | InstanceId, next: ClipboardMode): void {
    nodeId.value = id
    mode.value = next
  }

  function clearClipboard(): void {
    nodeId.value = null
    mode.value = null
  }

  return { nodeId, mode, setClipboard, clearClipboard }
})

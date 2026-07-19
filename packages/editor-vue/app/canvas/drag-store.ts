import { defineStore } from "pinia"
import { ref } from "vue"

/**
 * Global state for an in-progress objects-sidebar drag. Set by the drag monitor
 * on drag start and cleared on drop. The canvas reads it to hide overlays that
 * cannot follow a node mid-reorder, such as the selection outline. Mirrors the
 * React `use-drag-state` store.
 */
export const useDragStore = defineStore("drag", () => {
  const isDragging = ref(false)
  const draggingNodeId = ref<string | null>(null)

  function setIsDragging(value: boolean): void {
    isDragging.value = value
  }

  function startDrag(nodeId: string): void {
    isDragging.value = true
    draggingNodeId.value = nodeId
  }

  function endDrag(): void {
    isDragging.value = false
    draggingNodeId.value = null
  }

  return { isDragging, draggingNodeId, setIsDragging, startDrag, endDrag }
})

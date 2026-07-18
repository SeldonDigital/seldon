import { defineStore } from "pinia"
import { ref } from "vue"

export type NodeRect = {
  top: number
  left: number
  width: number
  height: number
}

/**
 * Tracks the on-screen rectangle of the selected canvas node. The selection
 * overlay writes measured rects here; other chrome (guides, drag targets) can
 * read them without re-measuring the DOM. Mirrors the React rect tracking store
 * at a minimal surface.
 */
export const useRectStore = defineStore("rect", () => {
  const selectedRect = ref<NodeRect | null>(null)

  function setSelectedRect(rect: NodeRect | null): void {
    selectedRect.value = rect
  }

  return { selectedRect, setSelectedRect }
})

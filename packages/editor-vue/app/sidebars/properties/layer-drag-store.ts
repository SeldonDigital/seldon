import { defineStore } from "pinia"
import { ref } from "vue"
import type { LayeredPaintKey } from "@seldon/core"

/**
 * Tracks the layered-paint parent row currently being dragged, so sibling layer
 * rows of the same property can validate a drop and paint the indicator. Only
 * layers within the same property stack reorder.
 */
export const useLayerDragStore = defineStore("properties-layer-drag", () => {
  const property = ref<LayeredPaintKey | null>(null)
  const fromIndex = ref<number | null>(null)

  function start(nextProperty: LayeredPaintKey, index: number): void {
    property.value = nextProperty
    fromIndex.value = index
  }

  function end(): void {
    property.value = null
    fromIndex.value = null
  }

  return { property, fromIndex, start, end }
})

import type { ImageUploadTarget } from "@seldon/editor/lib/dialogs/image-upload-target"
import { defineStore } from "pinia"
import { ref } from "vue"

/**
 * Holds which image target the upload dialog writes to: the `source` attribute
 * or a background image facet. Set when the dialog opens and cleared on close.
 * Mirrors the React image-upload zustand store.
 */
export const useImageUploadStore = defineStore("image-upload", () => {
  const property = ref<ImageUploadTarget | null>(null)

  function setProperty(next: ImageUploadTarget): void {
    property.value = next
  }

  function reset(): void {
    property.value = null
  }

  return { property, setProperty, reset }
})

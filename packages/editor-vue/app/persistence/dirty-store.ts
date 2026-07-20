import { defineStore } from "pinia"
import { ref } from "vue"

/**
 * Tracks whether the in-memory workspace has unsaved edits relative to the
 * persisted copy. The dispatch pipeline marks it dirty; the save pipeline clears
 * it. Mirrors the React `setIsLocalWorkspaceDirty` sync flag.
 */
export const useDirtyStore = defineStore("dirty", () => {
  const isDirty = ref(false)

  function setDirty(value: boolean): void {
    isDirty.value = value
  }

  return { isDirty, setDirty }
})

import type { Workspace } from "@seldon/core/workspace/types"
import { defineStore } from "pinia"
import { ref } from "vue"

/**
 * Holds a transient preview workspace during drag/insert gestures. Preview
 * dispatches write here instead of history, so the canvas can render a
 * speculative state without polluting undo. Clearing returns rendering to the
 * committed workspace.
 */
export const usePreviewStore = defineStore("preview", () => {
  const preview = ref<Workspace | null>(null)

  function update(workspace: Workspace): void {
    preview.value = workspace
  }

  function clear(): void {
    preview.value = null
  }

  return { preview, update, clear }
})

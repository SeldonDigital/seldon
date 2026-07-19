import type { Workspace } from "@seldon/core/workspace/types"
import { defineStore } from "pinia"
import { shallowRef } from "vue"

/**
 * Holds a transient preview workspace during drag/insert gestures. Preview
 * dispatches write here instead of history, so the canvas can render a
 * speculative state without polluting undo. Clearing returns rendering to the
 * committed workspace.
 */
export const usePreviewStore = defineStore("preview", () => {
  // Preview holds an immutable core-produced (Immer-frozen) workspace snapshot.
  // A `shallowRef` keeps it raw so Vue never proxies the frozen graph; writes
  // replace the whole snapshot by reference, so reactivity still fires.
  const preview = shallowRef<Workspace | null>(null)

  function update(workspace: Workspace): void {
    preview.value = workspace
  }

  function clear(): void {
    preview.value = null
  }

  return { preview, update, clear }
})

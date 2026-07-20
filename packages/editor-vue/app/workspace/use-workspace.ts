import { useHistoryStore } from "@app/workspace/history-store"
import { usePreviewStore } from "@app/workspace/preview-store"
import { storeToRefs } from "pinia"
import { type ComputedRef, computed } from "vue"

import type { Workspace } from "@seldon/core/workspace/types"

/**
 * The workspace the editor renders: the transient preview overlay when a
 * preview session is active, otherwise the committed workspace from history.
 * Mirrors the React `useWorkspace` preview-aware read.
 */
export function useWorkspace(): { workspace: ComputedRef<Workspace> } {
  const history = useHistoryStore()
  const preview = usePreviewStore()
  const { current } = storeToRefs(history)
  const { preview: previewWorkspace } = storeToRefs(preview)

  const workspace = computed(() => previewWorkspace.value ?? current.value)
  return { workspace }
}

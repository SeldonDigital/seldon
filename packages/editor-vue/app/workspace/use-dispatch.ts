import { WorkspaceValidationError, workspaceReducer } from "@app/core"
import { useDebugStore } from "@app/editor/debug-store"
import { useDirtyStore } from "@app/persistence/dirty-store"
import { useToastStore } from "@app/toaster/toast-store"
import {
  getCurrentWorkspace,
  useHistoryStore,
} from "@app/workspace/history-store"
import { usePreviewStore } from "@app/workspace/preview-store"

import type { Action } from "@seldon/core"
import type { Workspace } from "@seldon/core/workspace/types"

/**
 * Returns a `dispatch` that reduces from the committed workspace and routes the
 * result to preview or history. Mirrors the React `useDispatch`: preview
 * dispatches update the preview store and stay silent on validation errors;
 * committed dispatches push history, mark dirty, and surface validation errors
 * as toasts. Reads stores through their singletons so callers never subscribe.
 */
export function useDispatch() {
  return (action: Action, isPreview = false): Workspace | undefined => {
    const debug = useDebugStore()
    const history = useHistoryStore()
    const preview = usePreviewStore()
    const dirty = useDirtyStore()
    const toast = useToastStore()

    const current = getCurrentWorkspace()

    if (debug.dispatchLogging) {
      console.groupCollapsed(`[dispatch] ${action.type}`)
      console.info("--- PAYLOAD ---")
      console.dir(action.payload)
      console.info("--- BEFORE ---")
      console.dir(current)
    }

    try {
      const next = workspaceReducer(current, action)

      if (isPreview) {
        preview.update(next)
      } else {
        history.push(next)
      }

      dirty.setDirty(true)

      if (debug.dispatchLogging) {
        console.info("--- AFTER ---")
        console.dir(next)
        console.groupEnd()
      }

      return next
    } catch (error) {
      if (error instanceof WorkspaceValidationError) {
        if (isPreview) return
        toast.addToast(error.message)
      } else if (error instanceof Error) {
        toast.addToast(error.message)
        throw error
      }
    }
  }
}

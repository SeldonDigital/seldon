"use client"

import { useCallback } from "react"
import { Action, invariant } from "@seldon/core/index"
import { WorkspaceValidationError } from "@seldon/core/workspace/middleware/validation/validation.middleware"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import { setIsLocalWorkspaceDirty } from "@lib/project/hooks/use-workspace-sync-status"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { useAddToast } from "@components/toaster/hooks/use-add-toast"
import { useHistory } from "./use-history"
import { usePreviewStore } from "./use-preview-store"

export function useWorkspace({
  usePreview = true,
}: { usePreview?: boolean } = {}) {
  const { push, current } = useHistory()
  const { dispatchLogging } = useDebugMode()
  const addToast = useAddToast()

  const { preview, initialize, update, reset } = usePreviewStore()

  const dispatch = useCallback(
    (action: Action, isPreview = false) => {
      if (dispatchLogging) {
        console.groupCollapsed(`[dispatch] ${action.type}`)
        console.info("--- PAYLOAD ---")
        console.dir(action.payload)
        console.info("--- BEFORE ---")
        console.dir(current)
      }

      try {
        const newState = workspaceReducer(current, action)

        if (isPreview) {
          update(newState)
        } else {
          push(newState)
        }

        setIsLocalWorkspaceDirty(true)

        if (dispatchLogging) {
          console.info("--- AFTER ---")
          console.dir(newState)
          console.groupEnd()
        }

        return newState
      } catch (error) {
        if (error instanceof WorkspaceValidationError) {
          // Previews are best-effort: skip the update and stay silent. The
          // committed dispatch on drop surfaces the real validation toast.
          if (isPreview) return
          addToast(error.message)
        } else if (error instanceof Error) {
          addToast(error.message)
          throw error
        }
      }
    },
    [dispatchLogging, current, push, addToast, update],
  )

  const startPreviewSession = useCallback(() => {
    initialize(current)
  }, [current, initialize])

  const commitPreview = useCallback(() => {
    invariant(preview, "Preview is not initialized")
    dispatch({
      type: "set_workspace",
      payload: { workspace: preview },
    })
    reset()
  }, [dispatch, preview, reset])

  const rollbackPreview = useCallback(() => {
    reset()
  }, [reset])

  const raw = usePreview ? preview || current : current

  return {
    dispatch,
    workspace: raw,
    startPreviewSession,
    commitPreview,
    rollbackPreview,
  }
}

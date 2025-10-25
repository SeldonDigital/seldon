import { useAddToast } from "@components/toaster/use-add-toast"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { setIsLocalWorkspaceDirty } from "@lib/project/hooks/use-workspace-sync-status"
import { useCallback } from "react"

import { Action, invariant } from "@seldon/core/index"
import { WorkspaceValidationError } from "@seldon/core/workspace/middleware/validation"
import { coreReducer } from "@seldon/core/workspace/reducers/core/reducer"

import { useHistory } from "./use-history"
import { usePreviewStore } from "./use-preview-store"

const isProduction = import.meta.env.PROD

export function useWorkspace({
  usePreview = true,
}: { usePreview?: boolean } = {}) {
  const { push, current } = useHistory()
  const { debugModeEnabled } = useDebugMode()
  const addToast = useAddToast()

  // Cache, update and reset the preview workspace
  const { preview, initialize, update, reset } = usePreviewStore()

  const dispatch = useCallback(
    (action: Action, isPreview = false) => {
      if (debugModeEnabled) {
        console.groupCollapsed(`[dispatch] ${action.type}`)
        console.info("--- PAYLOAD ---")
        console.dir(action.payload)
        console.info("--- BEFORE ---")
        console.dir(current)
      }

      try {
        const newState = coreReducer(current, action)

        if (isPreview) {
          // Update the preview store
          update(newState)
        } else {
          // Normal dispatch - add to history
          push(newState)
        }

        // Mark the workspace as dirty which will trigger a sync to the server
        setIsLocalWorkspaceDirty(true)

        if (debugModeEnabled) {
          console.info("--- AFTER ---")
          console.dir(newState)
          console.groupEnd()
        }

        return newState
      } catch (error) {
        if (error instanceof WorkspaceValidationError) {
          addToast(error.message)
        } else {
          if (error instanceof Error) {
            addToast(
              isProduction
                ? "Unable to save your changes. Our developers have been notified of this issue."
                : error.message,
            )
          }

          throw error
        }
      }
    },
    [debugModeEnabled, current, push, addToast, update],
  )

  const startPreviewSession = useCallback(() => {
    initialize(current)
  }, [current, initialize])

  const commitPreview = useCallback(() => {
    invariant(preview, "Preview is not initialized")
    // Apply the preview workspace to the actual workspace
    dispatch({
      type: "set_workspace",
      payload: { workspace: preview },
    })
    // Clear the preview store
    reset()
  }, [dispatch, preview, reset])

  const rollbackPreview = useCallback(() => {
    reset()
  }, [reset])

  return {
    dispatch,
    workspace: usePreview ? preview || current : current,
    startPreviewSession,
    commitPreview,
    rollbackPreview,
  }
}

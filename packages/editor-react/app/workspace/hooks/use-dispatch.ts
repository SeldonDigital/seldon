"use client"

import { useDebugStore } from "@app/editor/hooks/use-debug-mode"
import { setIsLocalWorkspaceDirty } from "@app/project/hooks/use-workspace-sync-status"
import { useToastStore } from "@app/toaster/hooks/use-toast-store"
import { useCallback } from "react"

import { Action } from "@seldon/core/index"
import { WorkspaceValidationError } from "@seldon/core/workspace/middleware/validation/validation.middleware"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"

import { getCurrentWorkspace, useHistoryStore } from "./use-history"
import { usePreviewStore } from "./use-preview-store"

/**
 * Returns a stable `dispatch` that never subscribes the calling component to
 * workspace state. It reads the current workspace and the history, preview,
 * toast, and debug stores through `getState()` at call time, so action-only
 * consumers (rows, commands, event handlers) do not re-render on every edit.
 *
 * Behavior matches the `dispatch` returned by `useWorkspace`: it reduces from
 * the committed workspace, writes to the preview store for preview dispatches
 * and to history otherwise, marks the workspace dirty, and surfaces validation
 * errors as toasts.
 */
export function useDispatch() {
  return useCallback((action: Action, isPreview = false) => {
    const { dispatchLogging } = useDebugStore.getState()
    const current = getCurrentWorkspace()

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
        usePreviewStore.getState().update(newState)
      } else {
        useHistoryStore.getState().push(newState)
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
        useToastStore.getState().addToast(error.message)
      } else if (error instanceof Error) {
        useToastStore.getState().addToast(error.message)
        throw error
      }
    }
  }, [])
}

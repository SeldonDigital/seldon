"use client"

import { useCallback } from "react"

import { invariant } from "@seldon/core/index"

import { useDispatch } from "./use-dispatch"
import { useHistory } from "./use-history"
import { usePreviewStore } from "./use-preview-store"

export function useWorkspace({
  usePreview = true,
}: { usePreview?: boolean } = {}) {
  const { current } = useHistory()

  const { preview, initialize, reset } = usePreviewStore()

  const dispatch = useDispatch()

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

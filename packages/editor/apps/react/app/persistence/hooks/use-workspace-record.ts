"use client"

import { getStoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"
import { useEffect, useState } from "react"

import type { StoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"

/**
 * Loads a stored workspace record once, for reading.
 *
 * The record is a snapshot taken at mount and never refreshed, so it goes stale
 * as soon as autosave writes again. Writes belong to `workspace-save-store`,
 * which owns the live record and is the only writer.
 */
export function useWorkspaceRecord(workspaceId: string | null) {
  const [record, setRecord] = useState<StoredWorkspace | null>(null)
  const [loading, setLoading] = useState(Boolean(workspaceId))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!workspaceId) {
      setRecord(null)
      setLoading(false)

      return
    }

    let cancelled = false

    setLoading(true)
    setError(null)

    getStoredWorkspace(workspaceId)
      .then((stored) => {
        if (cancelled) return

        if (!stored) {
          setError("Workspace not found")
          setRecord(null)
        } else {
          setRecord(stored)
        }

        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load workspace")
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [workspaceId])

  return { record, loading, error }
}

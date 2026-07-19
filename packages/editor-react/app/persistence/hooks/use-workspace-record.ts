"use client"

import {
  type StoredWorkspace,
  getStoredWorkspace,
  saveStoredWorkspace,
} from "@lib/storage/workspace-store"
import { useCallback, useEffect, useState } from "react"

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
        setError(
          err instanceof Error ? err.message : "Failed to load workspace",
        )
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [workspaceId])

  const updateRecord = useCallback(
    async (patch: Partial<Pick<StoredWorkspace, "name" | "workspace">>) => {
      if (!record) return
      const next: StoredWorkspace = {
        ...record,
        ...patch,
        updatedAt: new Date().toISOString(),
      }
      await saveStoredWorkspace(next)
      setRecord(next)
    },
    [record],
  )

  return { record, loading, error, updateRecord }
}

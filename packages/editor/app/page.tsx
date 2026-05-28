"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { createEmptyWorkspace } from "@seldon/core"
import {
  createStoredWorkspace,
  deleteStoredWorkspace,
  listStoredWorkspaces,
  type StoredWorkspace,
} from "@lib/storage/workspace-store"
import { selectFile } from "@lib/utils/select-file"
import { workspacePropagationService } from "@seldon/core/workspace/services/propagation/workspace-propagation.service"
import type { Workspace } from "@seldon/core/workspace/types"

export default function HomePage() {
  const router = useRouter()
  const [workspaces, setWorkspaces] = useState<StoredWorkspace[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setWorkspaces(await listStoredWorkspaces())
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const handleNew = useCallback(async () => {
    const name = prompt("Workspace name", "Untitled") ?? "Untitled"
    const record = await createStoredWorkspace(name, createEmptyWorkspace())
    router.push(`/${record.id}`)
  }, [router])

  const handleImport = useCallback(async () => {
    const file = await selectFile({ accept: ".json,application/json" })
    if (!file) return
    const text = await file.text()
    const workspace = workspacePropagationService.parseWorkspace(text) as Workspace
    const name = file.name.replace(/\.json$/i, "") || "Imported workspace"
    const record = await createStoredWorkspace(name, workspace)
    router.push(`/${record.id}`)
  }, [router])

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this workspace?")) return
      await deleteStoredWorkspace(id)
      await refresh()
    },
    [refresh],
  )

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 p-10 text-white">
      <header>
        <h1 className="text-2xl font-semibold">Seldon Local Editor</h1>
        <p className="mt-2 text-sm text-white/70">
          Workspaces are stored in this browser only. Open a workspace.json file
          or create a new workspace.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded bg-white px-4 py-2 text-sm font-medium text-black"
          onClick={() => void handleNew()}
        >
          New workspace
        </button>
        <button
          type="button"
          className="rounded border border-white/30 px-4 py-2 text-sm"
          onClick={() => void handleImport()}
        >
          Open workspace.json
        </button>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-white/50">
          Recent workspaces
        </h2>
        {loading ? (
          <p className="text-sm text-white/60">Loading…</p>
        ) : workspaces.length === 0 ? (
          <p className="text-sm text-white/60">No workspaces yet.</p>
        ) : (
          <ul className="divide-y divide-white/10 rounded border border-white/10">
            {workspaces.map((ws) => (
              <li
                key={ws.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <Link href={`/${ws.id}`} className="min-w-0 flex-1 hover:underline">
                  <span className="block truncate font-medium">{ws.name}</span>
                  <span className="text-xs text-white/50">
                    Updated {new Date(ws.updatedAt).toLocaleString()}
                  </span>
                </Link>
                <button
                  type="button"
                  className="text-xs text-white/50 hover:text-white"
                  onClick={() => void handleDelete(ws.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

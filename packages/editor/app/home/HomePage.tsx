import { selectFile } from "@lib/helpers/select-file"
import {
  type StoredWorkspace,
  createStoredWorkspace,
  deleteStoredWorkspace,
  listStoredWorkspaces,
} from "@lib/storage/workspace-store"
import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { createEmptyWorkspace } from "@seldon/core"
import { workspacePropagationService } from "@seldon/core/workspace/services/propagation/workspace-propagation.service"
import type { Workspace } from "@seldon/core/workspace/types"
import "./home.css"

export default function HomePage() {
  const navigate = useNavigate()
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
    navigate(`/${record.id}`)
  }, [navigate])

  const handleImport = useCallback(async () => {
    const result = await selectFile({ accept: ".json,application/json" })
    if (!result.success) return
    const { file } = result
    const text = await file.text()
    const workspace = workspacePropagationService.parseWorkspace(
      text,
    ) as Workspace
    const name = file.name.replace(/\.json$/i, "") || "Imported workspace"
    const record = await createStoredWorkspace(name, workspace)
    navigate(`/${record.id}`)
  }, [navigate])

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this workspace?")) return
      await deleteStoredWorkspace(id)
      await refresh()
    },
    [refresh],
  )

  return (
    <main className="home">
      <header>
        <h1 className="home-title">Seldon · Editor</h1>
        <p className="home-subtitle">
          Workspaces are stored in this browser only. Open a workspace.json file
          or create a new workspace.
        </p>
      </header>

      <div className="home-actions">
        <button
          type="button"
          className="home-button home-button-primary"
          onClick={() => void handleNew()}
        >
          New workspace
        </button>
        <button
          type="button"
          className="home-button home-button-secondary"
          onClick={() => void handleImport()}
        >
          Open workspace.json
        </button>
      </div>

      <section>
        <h2 className="home-section-title">Recent workspaces</h2>
        {loading ? (
          <p className="home-muted">Loading…</p>
        ) : workspaces.length === 0 ? (
          <p className="home-muted">No workspaces yet.</p>
        ) : (
          <ul className="home-list">
            {workspaces.map((ws) => (
              <li key={ws.id}>
                <Link to={`/${ws.id}`} className="home-list-link">
                  <span className="home-list-name">{ws.name}</span>
                  <span className="home-list-meta">
                    Updated {new Date(ws.updatedAt).toLocaleString()}
                  </span>
                </Link>
                <button
                  type="button"
                  className="home-delete"
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

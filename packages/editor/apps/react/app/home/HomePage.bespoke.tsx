// BESPOKE-VIEW: hand-authored home screen markup. Styling comes from home.css.
import { HOME_CONTENT } from "@seldon/editor/lib/home/home-content"
import { type StoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"

import "./home.css"

interface HomeViewProps {
  workspaces: StoredWorkspace[]
  loading: boolean
  onNew: () => void
  onImport: () => void
  onOpen: (workspace: StoredWorkspace) => void
  onDelete: (id: string) => void
}

/** The name to show for a stored workspace, falling back for an unnamed one. */
function workspaceName(record: StoredWorkspace): string {
  return record.workspace.metadata.label || HOME_CONTENT.defaultWorkspaceName
}

/** Where a workspace is stored: its bound project, or the editor's live store. */
function storeLabel(record: StoredWorkspace): string {
  return record.boundProject ? `Project: ${record.boundProject}` : "Local"
}

/** Home screen: create, import, and open recently stored workspaces. */
export function HomeView({
  workspaces,
  loading,
  onNew,
  onImport,
  onOpen,
  onDelete,
}: HomeViewProps) {
  return (
    <main className="home">
      <header>
        <h1 className="home-title">{HOME_CONTENT.title}</h1>
        <p className="home-subtitle">{HOME_CONTENT.subtitle("Vue")}</p>
      </header>

      <div className="home-actions">
        <button type="button" className="home-button home-button-primary" onClick={onNew}>
          {HOME_CONTENT.newWorkspaceButton}
        </button>
        <button type="button" className="home-button home-button-secondary" onClick={onImport}>
          {HOME_CONTENT.openWorkspaceButton}
        </button>
      </div>

      <section>
        <h2 className="home-section-title">{HOME_CONTENT.recentWorkspacesHeading}</h2>
        {loading ? (
          <p className="home-muted">{HOME_CONTENT.loading}</p>
        ) : workspaces.length === 0 ? (
          <p className="home-muted">{HOME_CONTENT.noWorkspaces}</p>
        ) : (
          <ul className="home-list">
            {workspaces.map((ws) => (
              <li key={ws.id}>
                <button type="button" className="home-list-link" onClick={() => onOpen(ws)}>
                  <span className="home-list-name">{workspaceName(ws)}</span>
                  <span className="home-list-meta">
                    <span className="home-list-store">{storeLabel(ws)}</span> · Updated{" "}
                    {new Date(ws.updatedAt).toLocaleString()}
                  </span>
                </button>
                <button type="button" className="home-delete" onClick={() => onDelete(ws.id)}>
                  {HOME_CONTENT.deleteButton}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

// BESPOKE-VIEW: hand-authored home screen markup. Styling comes from home.css.
import { type StoredWorkspace } from "@lib/storage/workspace-store"
import { Link } from "react-router"
import "./home.css"

interface HomeViewProps {
  workspaces: StoredWorkspace[]
  loading: boolean
  onNew: () => void
  onImport: () => void
  onDelete: (id: string) => void
}

/** Home screen: create, import, and open recently stored workspaces. */
export function HomeView({
  workspaces,
  loading,
  onNew,
  onImport,
  onDelete,
}: HomeViewProps) {
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
          onClick={onNew}
        >
          New workspace
        </button>
        <button
          type="button"
          className="home-button home-button-secondary"
          onClick={onImport}
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
                  onClick={() => onDelete(ws.id)}
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

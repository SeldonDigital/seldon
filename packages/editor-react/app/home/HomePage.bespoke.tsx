// BESPOKE-VIEW: hand-authored home screen markup. Styling comes from home.css.
import { HOME_CONTENT } from "@seldon/editor/lib/home/home-content"
import { type StoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"
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
        <h1 className="home-title">{HOME_CONTENT.title}</h1>
        <p className="home-subtitle">{HOME_CONTENT.subtitle("Vue")}</p>
      </header>

      <div className="home-actions">
        <button
          type="button"
          className="home-button home-button-primary"
          onClick={onNew}
        >
          {HOME_CONTENT.newWorkspaceButton}
        </button>
        <button
          type="button"
          className="home-button home-button-secondary"
          onClick={onImport}
        >
          {HOME_CONTENT.openWorkspaceButton}
        </button>
      </div>

      <section>
        <h2 className="home-section-title">
          {HOME_CONTENT.recentWorkspacesHeading}
        </h2>
        {loading ? (
          <p className="home-muted">{HOME_CONTENT.loading}</p>
        ) : workspaces.length === 0 ? (
          <p className="home-muted">{HOME_CONTENT.noWorkspaces}</p>
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

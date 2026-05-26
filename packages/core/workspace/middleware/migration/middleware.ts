import type { Middleware } from "../../types"
import { alwaysRunMigrations, migrations } from "./migrations"

/** Current workspace file migration counter (`metadata.version`). */
export const CURRENT_WORKSPACE_VERSION = 4

function runVersionedMigrations(workspace: import("../../types").Workspace) {
  let current = workspace
  const startVersion = workspace.metadata.version ?? 0

  for (const migration of migrations) {
    if (migration.version > startVersion) {
      current = migration.migrate(current)
    }
  }

  for (const migration of alwaysRunMigrations) {
    current = migration.migrate(current)
  }

  return current
}

/**
 * On `set_workspace`, runs versioned migrations and normalizes `metadata.version`.
 */
export const migrationMiddleware: Middleware =
  (next) => (workspace, action) => {
    const nextWorkspace = next(workspace, action)

    if (action.type !== "set_workspace") {
      return nextWorkspace
    }

    const migrated = runVersionedMigrations(nextWorkspace)

    return {
      ...migrated,
      metadata: {
        ...migrated.metadata,
        version: CURRENT_WORKSPACE_VERSION,
      },
    }
  }

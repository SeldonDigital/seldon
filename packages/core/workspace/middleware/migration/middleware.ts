import { Middleware } from "../../types"
import { migrations, schemaMigrations } from "./migrations"

// Current workspace version - increment this when making breaking changes
export const CURRENT_WORKSPACE_VERSION = migrations[0].version

/**
 * Migration middleware that ensures the workspace is at the current version
 * by applying any necessary migrations in sequence.
 */
export const migrationMiddleware: Middleware =
  (next) => (workspace, action) => {
    // Make sure we run the other middlewares and the reducer first
    const nextWorkspace = next(workspace, action)

    // Only apply migrations for set_workspace actions to avoid performance impact
    if (action.type !== "set_workspace") {
      return nextWorkspace
    }

    let currentVersion = nextWorkspace.version || 1

    // Handle baselining: check for structural indicators of legacy workspaces
    // Legacy workspaces have boards without the 'component' field, which was added in migration 3
    const hasLegacyBoards = Object.values(nextWorkspace.boards || {}).some(
      (board) => !("component" in board),
    )

    // If workspace has legacy board structure, baseline it to 0 for full migration
    if (hasLegacyBoards) {
      currentVersion = 0
    }

    // If workspace is already at current version, no migration needed
    if (currentVersion >= CURRENT_WORKSPACE_VERSION) {
      return nextWorkspace
    }

    // Apply migrations in sequence
    let migratedWorkspace = { ...nextWorkspace }

    const alwaysRunMigrations = [...schemaMigrations].reverse()
    const otherMigrations = [...migrations].reverse()

    for (const migration of alwaysRunMigrations) {
      try {
        migratedWorkspace = migration.migrate(migratedWorkspace)
      } catch (error) {
        throw new Error(
          `Migration ${migration.description} failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        )
      }
    }

    for (const migration of otherMigrations) {
      if (
        migration.version > currentVersion &&
        migration.version <= CURRENT_WORKSPACE_VERSION
      ) {
        try {
          migratedWorkspace = migration.migrate(migratedWorkspace)

          // Update version after successful migration by creating a new object
          migratedWorkspace = {
            ...migratedWorkspace,
            version: migration.version,
          }
        } catch (error) {
          throw new Error(
            `Migration ${migration.version} failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          )
        }
      }
    }

    // Ensure final version is set by creating a new object
    migratedWorkspace = {
      ...migratedWorkspace,
      version: CURRENT_WORKSPACE_VERSION,
    }

    return migratedWorkspace
  }

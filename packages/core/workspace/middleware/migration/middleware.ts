import type { Middleware } from "../../types"
import {
  CURRENT_WORKSPACE_VERSION,
  migrateWorkspace,
} from "./migrate-workspace"

export { CURRENT_WORKSPACE_VERSION }

/** On `set_workspace`, runs pending migrations and stamps `metadata.version`. */
export const migrationMiddleware: Middleware =
  (next) => (workspace, action) => {
    const nextWorkspace = next(workspace, action)

    if (action.type !== "set_workspace") {
      return nextWorkspace
    }

    const migrated = migrateWorkspace(nextWorkspace)

    return {
      ...migrated,
      metadata: {
        ...migrated.metadata,
        version: CURRENT_WORKSPACE_VERSION,
      },
    }
  }

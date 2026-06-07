import type { Middleware } from "../../types"

/**
 * Current workspace file version. The flattened v0 baseline ships no historical
 * migrations, so files saved before v0 are not guaranteed to load.
 */
export const CURRENT_WORKSPACE_VERSION = 0

/** On `set_workspace`, normalizes `metadata.version` to the current baseline. */
export const migrationMiddleware: Middleware =
  (next) => (workspace, action) => {
    const nextWorkspace = next(workspace, action)

    if (action.type !== "set_workspace") {
      return nextWorkspace
    }

    return {
      ...nextWorkspace,
      metadata: {
        ...nextWorkspace.metadata,
        version: CURRENT_WORKSPACE_VERSION,
      },
    }
  }

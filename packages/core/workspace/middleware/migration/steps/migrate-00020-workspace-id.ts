import type { Workspace } from "../../../model/workspace"

/**
 * v20: give every workspace a stable `metadata.id`.
 *
 * Identity used to live only in the live-store wrapper, so an exported workspace
 * copy carried none and could not be matched back to the record it came from.
 * This step mints an id when one is missing, so a persisted file always carries
 * its own identity. The storage layer seeds the id from the wrapper record
 * before this runs, so a live record keeps its existing id and only a truly
 * id-less file, such as a legacy export copy, receives a fresh one.
 *
 * Runs as a versioned step for files below v20 and as a repair on every load, so
 * a file already stamped at the current version, including a freshly created
 * one, still gains an id. Guarded and idempotent: an id already present is left
 * untouched, so re-running never changes it.
 */
export function migrateV20WorkspaceId(workspace: Workspace): Workspace {
  if (workspace.metadata.id) return workspace

  return {
    ...workspace,
    metadata: {
      ...workspace.metadata,
      id: crypto.randomUUID(),
    },
  }
}

import type { Workspace } from "../../../model/workspace"

/**
 * v1: baseline migration. Returns the workspace unchanged.
 *
 * This is the first step of a freshly reset migration chain. Add real
 * transforms in later steps starting at `migrate-00002-*`.
 */
export function migrateV1Baseline(workspace: Workspace): Workspace {
  return workspace
}

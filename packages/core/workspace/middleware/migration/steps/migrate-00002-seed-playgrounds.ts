import type { Workspace } from "../../../model/workspace"

/**
 * v2: ensure the top-level `playgrounds` map exists.
 *
 * Files written before the playgrounds section was added have no `playgrounds`
 * key. Seed it with an empty map so the rest of the pipeline can treat it as a
 * normal section.
 */
export function migrateV2SeedPlaygrounds(workspace: Workspace): Workspace {
  if (workspace.playgrounds) return workspace
  return { ...workspace, playgrounds: {} }
}

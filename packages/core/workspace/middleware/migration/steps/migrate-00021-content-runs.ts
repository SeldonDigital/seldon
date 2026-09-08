import type { Workspace } from "../../../model/workspace"

/**
 * v21: content-bearing primitives may store an optional `runs` list.
 *
 * Existing files have no `runs` key. Missing runs stay valid and render as a
 * text node from `content`. This step is an identity so the version stamp
 * advances without rewriting nodes.
 */
export function migrateV21ContentRuns(workspace: Workspace): Workspace {
  return workspace
}

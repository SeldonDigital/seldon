import { parseWorkspace } from "../helpers/parse-workspace"
import { workspaceReducer } from "./reducer"

import type { Workspace } from "../model/workspace"

/**
 * Reads serialized workspace JSON through the full load path. Use this from any
 * tool that opens a workspace file, rather than parsing the JSON directly.
 *
 * `parseWorkspace` checks the top-level shape and restores each node's `id` from
 * its key, then the result runs through {@link workspaceReducer} as a
 * `set_workspace` action so migration upgrades `metadata.version` and
 * verification checks integrity. Throws when the text is malformed, when the file
 * is newer than this version supports, or when an integrity check fails.
 */
export function loadWorkspace(json: string): Workspace {
  const parsed = parseWorkspace(json)

  return workspaceReducer(parsed, { type: "set_workspace", payload: { workspace: parsed } })
}

import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"

import type { ExportOptions, FileToExport } from "../types"
import type { Workspace } from "@seldon/core"

/**
 * Builds the `workspace.json` copy that ships beside the generated components.
 *
 * The workspace is ordered with `orderWorkspaceNodeKeys`, the same helper the
 * editor uses when it writes a workspace, so the file matches what a user would
 * download and stays stable across re-exports. Output is pretty-printed with a
 * trailing newline so it diffs cleanly in a repository.
 *
 * That helper drops each node's redundant `id`, since it always repeats the key
 * the node is stored under. Anything reading this file back must go through
 * `loadWorkspace` to restore them.
 */
export function generateWorkspaceCopy(workspace: Workspace, options: ExportOptions): FileToExport {
  const path = `${options.output.componentsFolder}/workspace.json`.replaceAll("//", "/")

  return {
    path,
    content: `${JSON.stringify(orderWorkspaceNodeKeys(workspace), null, 2)}\n`,
  }
}

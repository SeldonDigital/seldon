import { kebabCase } from "change-case"

import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"

import type { ExportOptions, FileToExport } from "../types"
import type { Workspace } from "@seldon/core"

/**
 * Builds the workspace copy that ships beside the generated components.
 *
 * The file is named from the workspace label, kebab-cased, which is how a
 * downloaded workspace names itself too, so the copy and a download agree. A
 * workspace with no label falls back to `workspace.json`.
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
  const path = `${options.output.componentsFolder}/${getFileName(workspace)}`.replaceAll("//", "/")

  return {
    path,
    content: `${JSON.stringify(orderWorkspaceNodeKeys(workspace), null, 2)}\n`,
  }
}

/** A label of punctuation alone kebab-cases to nothing, so the result is checked. */
function getFileName(workspace: Workspace): string {
  const slug = kebabCase(workspace.metadata.label ?? "")

  return slug ? `${slug}.json` : "workspace.json"
}

import { kebabCase } from "change-case"

import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"

import { formatJson } from "./format-json"

import type { ExportOptions, FileToExport } from "../types"
import type { Workspace } from "@seldon/core"

/**
 * Builds the workspace copy that ships beside the generated components.
 *
 * The file is named `<label>.<framework>.json`, the workspace label kebab-cased
 * with the export target appended, such as `seldon-editor.react.json`. The label
 * keeps the copy recognizable, and the framework suffix marks it as generated
 * output, keeps it distinct from the editable source a project keeps at
 * `.seldon/workspace.json`, and lets a React and a Vue export sit side by side
 * without overwriting each other. A workspace with no label falls back to
 * `workspace.<framework>.json`.
 *
 * The workspace is ordered with `orderWorkspaceNodeKeys`, the same helper the
 * editor uses when it writes a workspace, so the file stays stable across
 * re-exports. Output is pretty-printed so it diffs cleanly in a repository.
 *
 * That helper drops each node's redundant `id`, since it always repeats the key
 * the node is stored under. Anything reading this file back must go through
 * `loadWorkspace` to restore them.
 */
export async function generateWorkspaceCopy(
  workspace: Workspace,
  options: ExportOptions,
): Promise<FileToExport> {
  const fileName = `${getBaseName(workspace)}.${options.target.framework}.json`
  const path = `${options.output.componentsFolder}/${fileName}`.replaceAll("//", "/")
  const content = await formatJson(JSON.stringify(orderWorkspaceNodeKeys(workspace), null, 2))

  return { path, content }
}

/** A label of punctuation alone kebab-cases to nothing, so the result is checked. */
function getBaseName(workspace: Workspace): string {
  return kebabCase(workspace.metadata.label ?? "") || "workspace"
}

import { kebabCase } from "change-case"
import {
  findProjectSourceFileName,
  writeProjectPointer,
  writeProjectSource,
} from "../storage/project-workspace-file"

import type { Workspace } from "@seldon/core/workspace/types"

/**
 * The source file name for a workspace and target, such as
 * `my-app-<workspace-id>.react.json`.
 *
 * The workspace label is kebab-cased, and the platform is appended so a React
 * and a Vue export of the same workspace sit side by side without overwriting
 * each other. A label of punctuation alone kebab-cases to nothing, so the result
 * is checked and falls back to `workspace`.
 */
export function workspaceSourceFileName(workspace: Workspace, platform: string): string {
  const base = kebabCase(workspace.metadata.label ?? "") || "workspace"
  const id = workspace.metadata.id?.replace(/[^a-zA-Z0-9_-]/g, "") ?? "unbound"

  return `${base}-${id}.${platform}.json`
}

/**
 * Writes the workspace source to `.seldon/<name>-<id>.<platform>.json` and
 * registers it in `.seldon/project.json`.
 *
 * A bound project keeps this file name once it exists. Later saves write the
 * same path so MCP and the CLI keep reading the file the editor just wrote.
 * The previous source is kept as a single `<file>.bak`.
 */
export async function writeWorkspaceSource(
  root: FileSystemDirectoryHandle,
  workspace: Workspace,
  platform: string,
): Promise<string> {
  const derived = workspaceSourceFileName(workspace, platform)
  const workspaceId = workspace.metadata.id

  if (!workspaceId) throw new Error("A workspace needs an id before it can bind to a project.")

  const fileName = (await findProjectSourceFileName(root, workspaceId, derived)) ?? derived

  await writeProjectSource(root, fileName, workspace)
  await writeProjectPointer(root, workspaceId, fileName, new Date().toISOString())

  return fileName
}

import { z } from "zod"

import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

import { resolvePathWithinRoots } from "../config"
import { ToolError } from "../errors"
import { redactValue } from "../redact"
import { readFileWithHash, writeWorkspaceAtomic } from "../session"
import type { WorkspaceCounts } from "./context"
import { type ToolContext, countWorkspace } from "./context"

export const workspaceOpenInputSchema = {
  path: z
    .string()
    .describe(
      "Path of the workspace JSON file. Must resolve inside one of the server's configured roots.",
    ),
  createIfMissing: z
    .boolean()
    .optional()
    .describe(
      "Create a new empty workspace at this path when the file does not exist.",
    ),
}

export interface WorkspaceOpenResult {
  filePath: string
  created: boolean
  label: string
  version: number
  counts: WorkspaceCounts
}

/**
 * Runs a loaded (or freshly created) workspace through Core's `set_workspace`
 * action so migration and verification apply. Throws a
 * teaching error carrying Core's message when the file fails verification.
 */
function loadViaSetWorkspace(
  candidate: Workspace,
  filePath: string,
): Workspace {
  const action = {
    type: "set_workspace",
    payload: { workspace: candidate },
  } as WorkspaceAction
  try {
    return workspaceReducer(createEmptyWorkspace(), action)
  } catch (error) {
    throw new ToolError({
      code: "workspace_file_invalid",
      message:
        `The file at "${filePath}" is not a valid Seldon workspace: ` +
        `${(error as Error).message}`,
      recovery:
        "Fix the workspace file, or open a different path (pass createIfMissing: " +
        "true with a new path to start a fresh workspace).",
    })
  }
}

export function workspaceOpen(
  ctx: ToolContext,
  input: { path: string; createIfMissing?: boolean },
): WorkspaceOpenResult {
  const absPath = resolvePathWithinRoots(input.path, ctx.config.roots)
  const file = readFileWithHash(absPath)

  if (file === null) {
    if (!input.createIfMissing) {
      throw new ToolError({
        code: "workspace_file_not_found",
        message: `No file exists at "${input.path}".`,
        recovery:
          "Pass createIfMissing: true to create a new workspace at this path, " +
          "or give the path of an existing workspace file.",
      })
    }
    const workspace = loadViaSetWorkspace(createEmptyWorkspace(), absPath)
    // Persist immediately so the disk file is current from the first moment
    // (the invariant: a crash never costs work, only rollback depth).
    const hash = writeWorkspaceAtomic(absPath, workspace)
    ctx.session.bind(absPath, workspace, hash)
    return summarize(ctx, true)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(file.text)
  } catch {
    // Never echo file contents (Node's JSON.parse message quotes the
    // offending snippet), so report only the fact.
    throw new ToolError({
      code: "workspace_file_invalid",
      message: `The file at "${input.path}" is not valid JSON.`,
      recovery:
        "Fix the file's JSON syntax, or open a different path. File contents " +
        "are not echoed in errors.",
    })
  }

  const workspace = loadViaSetWorkspace(parsed as Workspace, absPath)
  // Record the hash of the bytes actually on disk. If migration changed the
  // in-memory shape, the first accepted batch will sync the file.
  ctx.session.bind(absPath, workspace, file.hash)
  return summarize(ctx, false)
}

function summarize(ctx: ToolContext, created: boolean): WorkspaceOpenResult {
  const open = ctx.session.requireOpen()
  return redactValue({
    filePath: open.filePath,
    created,
    label: open.workspace.metadata.label ?? "",
    version: open.workspace.metadata.version,
    counts: countWorkspace(open.workspace),
  })
}

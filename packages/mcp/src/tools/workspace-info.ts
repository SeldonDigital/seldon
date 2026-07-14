import { redactValue } from "../redact"
import { diskChangedSince } from "../session"
import type { CheckpointSummary } from "./checkpoint"
import { summarizeCheckpoints } from "./checkpoint"
import type { WorkspaceCounts } from "./context"
import { type ToolContext, countWorkspace } from "./context"

export const workspaceInfoInputSchema = {}

export interface WorkspaceInfoResult {
  filePath: string
  metadata: {
    label: string
    version: number
    intent?: string
    tags?: string[]
  }
  counts: WorkspaceCounts
  /**
   * Always false in v1: every accepted batch auto-persists, so the
   * session never holds unsaved changes.
   */
  dirty: boolean
  /** Conflict status: the file changed on disk outside this session. */
  diskChangedExternally: boolean
  /** This session's in-memory checkpoints, oldest first. */
  checkpoints: CheckpointSummary[]
}

export function workspaceInfo(ctx: ToolContext): WorkspaceInfoResult {
  const open = ctx.session.requireOpen()
  const { metadata } = open.workspace
  return redactValue({
    filePath: open.filePath,
    metadata: {
      label: metadata.label ?? "",
      version: metadata.version,
      intent: metadata.intent,
      tags: metadata.tags,
    },
    counts: countWorkspace(open.workspace),
    dirty: false,
    diskChangedExternally: diskChangedSince(open),
    checkpoints: summarizeCheckpoints(ctx),
  })
}

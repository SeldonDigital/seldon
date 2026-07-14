import fs from "node:fs"
import path from "node:path"

import type { ToolContext } from "./tools/context"

/**
 * Observability events: every tool call — with its rejection
 * code, schema bounces, and no-op flags — plus zero-result
 * searches. This is the tier-promotion and synonym-curation evidence stream
 * for post-launch metrics. Events append as JSONL to
 * `.seldon/mcp-log.jsonl` next to the open workspace file (no
 * rotation in v1); with no workspace open they go to stderr, so the
 * evidence is never silently dropped.
 *
 * Logging must never break a tool call: all failures are swallowed into a
 * single stderr line.
 */
export interface ZeroResultSearchEvent {
  event: "search_zero_results"
  query: string
  kind?: string
  target?: string
  /** Matches above threshold before the target filter emptied them. */
  matchesBeforeTargetFilter: number
  /** Whether embedding similarity participated in the ranking. */
  semantic: boolean
}

/** One entry per tool invocation, success or rejection. */
export interface ToolCallEvent {
  event: "tool_call"
  tool: string
  ok: boolean
  durationMs: number
  /** Rejections: the teaching-error code. */
  errorCode?: string
  /** Rejections inside a batch: which action failed, by position and type. */
  failedAction?: { index: number; type: string }
  /** Teaching bounce on set_node_properties (schema-bounce metric). */
  schemaBounce?: boolean
  /** Successful batches: how many actions were accepted but changed nothing
   * (the no-op flag metric). */
  noopActions?: number
}

export type ObservabilityEvent = ZeroResultSearchEvent | ToolCallEvent

export const LOG_DIR_NAME = ".seldon"
export const LOG_FILE_NAME = "mcp-log.jsonl"

/** The log path for the session's open workspace, or null when none is open. */
export function logFilePathFor(ctx: ToolContext): string | null {
  const open = ctx.session.open
  if (!open) return null
  return path.join(path.dirname(open.filePath), LOG_DIR_NAME, LOG_FILE_NAME)
}

export function logEvent(ctx: ToolContext, event: ObservabilityEvent): void {
  const line = JSON.stringify({ ts: new Date().toISOString(), ...event })
  try {
    const logPath = logFilePathFor(ctx)
    if (logPath) {
      fs.mkdirSync(path.dirname(logPath), { recursive: true })
      fs.appendFileSync(logPath, line + "\n")
    } else {
      // stdout is the MCP protocol channel; operator output goes to stderr.
      console.error(`[seldon-mcp] ${line}`)
    }
  } catch (error) {
    console.error(
      `[seldon-mcp] failed to write observability log: ${(error as Error).message}`,
    )
  }
}

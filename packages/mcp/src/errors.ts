/**
 * Teaching errors: every rejection a tool returns must be
 * actionable from the error alone. Each error carries a stable machine code,
 * what went wrong, and a `recovery` sentence telling the agent what to do
 * next. `detail` holds whatever structured data makes the recovery
 * self-servicing (e.g. the exposed-action list on a whitelist rejection).
 */
export type TeachingErrorCode =
  | "no_workspace_open"
  | "path_outside_roots"
  | "workspace_file_not_found"
  | "workspace_file_invalid"
  | "action_not_exposed"
  | "action_rejected"
  | "write_conflict"
  | "node_not_found"
  | "board_not_found"
  | "component_not_found"
  | "theme_not_found"
  | "unknown_property"
  | "property_schema_not_served"
  | "checkpoint_not_found"
  | "invalid_render_target"
  | "render_failed"
  | "internal_error"

export interface TeachingError {
  code: TeachingErrorCode
  message: string
  recovery: string
  /** Which action in the batch failed: position and type. */
  failedAction?: { index: number; type: string }
  detail?: Record<string, unknown>
}

/** Thrown by tool implementations; the server maps it to an MCP error result. */
export class ToolError extends Error {
  readonly teaching: TeachingError

  constructor(teaching: TeachingError) {
    super(teaching.message)
    this.name = "ToolError"
    this.teaching = teaching
  }
}

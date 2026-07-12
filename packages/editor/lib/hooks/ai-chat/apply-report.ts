import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import type {
  BoardKey,
  Workspace,
  WorkspaceAction,
} from "@seldon/core/workspace/types"

export interface RejectedAction {
  type: string
  reason: string
}

export interface ApplyReport {
  workspace: Workspace
  applied: string[]
  ineffective: string[]
  rejected: RejectedAction[]
  /** Actions that produced a real change, kept for the console change summary. */
  appliedActions: WorkspaceAction[]
}

/** Finds the board map key for the currently active board, if any. */
export function findActiveBoardKey(
  workspace: Workspace,
  activeBoard: Workspace["boards"][BoardKey] | null,
): BoardKey | undefined {
  if (!activeBoard) return undefined
  return Object.keys(workspace.boards).find(
    (key) => workspace.boards[key] === activeBoard,
  )
}

/** True when applying an action left the workspace effectively unchanged. */
function isUnchanged(before: Workspace, after: Workspace): boolean {
  if (before === after) return true
  return JSON.stringify(before) === JSON.stringify(after)
}

/**
 * Applies actions one at a time through the reducer so each turn is a single
 * undo step (via one `set_workspace` dispatch by the caller) while still
 * reporting per-action results. The reducer runs core validation, so an invalid
 * action throws and is recorded as rejected. An action that validates but
 * matches nothing is recorded as ineffective, which the chat surfaces instead of
 * a misleading success.
 */
export function applyActionsWithReport(
  current: Workspace,
  actions: WorkspaceAction[],
): ApplyReport {
  let workspace = current
  const applied: string[] = []
  const ineffective: string[] = []
  const rejected: RejectedAction[] = []
  const appliedActions: WorkspaceAction[] = []

  for (const action of actions) {
    try {
      const next = applyActions(workspace, [action])
      if (isUnchanged(workspace, next)) {
        ineffective.push(action.type)
      } else {
        applied.push(action.type)
        appliedActions.push(action)
        workspace = next
      }
    } catch (caught) {
      rejected.push({
        type: action.type,
        reason: caught instanceof Error ? caught.message : "invalid action",
      })
    }
  }

  return { workspace, applied, ineffective, rejected, appliedActions }
}

/** Resolves the primary target id from an action payload. */
function targetIdOf(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined
  const bag = payload as Record<string, unknown>
  for (const key of ["nodeId", "instanceId", "variantId", "boardKey"]) {
    if (typeof bag[key] === "string") return bag[key] as string
  }
  return undefined
}

/** A short label for a target id, preferring the node or board label. */
function labelFor(workspace: Workspace, id: string | undefined): string {
  if (!id) return "workspace"
  const node = workspace.nodes?.[id]
  if (node?.label) return node.label
  const board = workspace.boards?.[id]
  if (board?.label) return board.label
  return id
}

/** Compact serialization of a tagged property value, e.g. `@swatch.primary`. */
function summarizeValue(value: unknown): string {
  if (value && typeof value === "object" && "value" in value) {
    const inner = (value as { value?: unknown }).value
    if (typeof inner === "string" || typeof inner === "number") {
      return String(inner)
    }
    return JSON.stringify(inner)
  }
  return typeof value === "string" ? value : JSON.stringify(value)
}

/** The property key/value pairs an action sets, if any. */
function changedProperties(action: WorkspaceAction): [string, unknown][] {
  const payload = (action as { payload?: unknown }).payload
  if (!payload || typeof payload !== "object") return []
  const properties = (payload as Record<string, unknown>).properties
  if (!properties || typeof properties !== "object") return []
  return Object.entries(properties as Record<string, unknown>)
}

/**
 * Builds one human-readable row per applied change for the outcome block. Each
 * row names the target and the property it set, falling back to the action type
 * when the action carries no property map.
 */
export function describeChanges(
  workspace: Workspace,
  report: ApplyReport,
): string[] {
  const rows: string[] = []
  for (const action of report.appliedActions) {
    const label = labelFor(workspace, targetIdOf(action.payload))
    const props = changedProperties(action)
    if (props.length === 0) {
      rows.push(`${label}: ${action.type}`)
      continue
    }
    for (const [key, value] of props) {
      rows.push(`${label} ${key}: ${summarizeValue(value)}`)
    }
  }
  return rows
}

/** Builds the assistant transcript line from the model reply and apply report. */
export function formatOutcome(reply: string, report: ApplyReport): string {
  const parts: string[] = []
  if (reply) parts.push(reply)
  if (report.applied.length > 0) {
    parts.push(`Applied: ${report.applied.join(", ")}`)
  }
  if (report.ineffective.length > 0) {
    parts.push(`No effect (matched nothing): ${report.ineffective.join(", ")}`)
  }
  if (report.rejected.length > 0) {
    parts.push(
      `Rejected: ${report.rejected
        .map((item) => `${item.type} (${item.reason})`)
        .join("; ")}`,
    )
  }
  if (parts.length === 0) parts.push("No actions returned.")
  return parts.join("\n")
}

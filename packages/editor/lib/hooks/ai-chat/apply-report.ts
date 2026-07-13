import { getPropertyCategory } from "@seldon/core/properties/schemas/helpers"
import { getImmediateParentIdInWorkspace } from "@seldon/core/workspace/helpers/components/get-node-parent-id"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
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

/** Uppercases the first letter, used to title an unlabeled node's component id. */
function capitalize(text: string): string {
  return text.length > 0 ? text[0]!.toUpperCase() + text.slice(1) : text
}

/** Display label for one path segment: node label, else component id, else id. */
function segmentLabel(workspace: Workspace, id: string): string {
  const node = workspace.nodes?.[id]
  if (node?.label) return node.label
  const board = workspace.boards?.[id]
  if (board?.label) return board.label
  const catalogId = node ? getNodeCatalogId(node, workspace) : undefined
  return catalogId ? capitalize(catalogId) : id
}

/**
 * The ancestry path to a target as `label/label/label`, root first. A board key
 * resolves to its label, and an unknown id passes through, so every target still
 * reads as one line even when it is not a node.
 */
function targetPath(workspace: Workspace, id: string | undefined): string {
  if (!id) return "workspace"
  if (workspace.boards?.[id]) return workspace.boards[id]!.label ?? id
  if (!workspace.nodes?.[id]) return id

  const segments: string[] = []
  const seen = new Set<string>()
  let currentId: string | undefined = id
  while (currentId && !seen.has(currentId)) {
    seen.add(currentId)
    segments.unshift(segmentLabel(workspace, currentId))
    currentId = getImmediateParentIdInWorkspace(workspace, currentId) ?? undefined
  }
  return segments.join("/")
}

/** Compact serialization of a tagged property value, e.g. `@swatch.primary` or `8px`. */
function summarizeValue(value: unknown): string {
  if (value && typeof value === "object" && "value" in value) {
    const inner = (value as { value?: unknown }).value
    if (inner && typeof inner === "object" && "value" in (inner as object)) {
      const length = inner as { value?: unknown; unit?: unknown }
      if (typeof length.value === "number") {
        return `${length.value}${typeof length.unit === "string" ? length.unit : ""}`
      }
    }
    if (typeof inner === "string" || typeof inner === "number") {
      return String(inner)
    }
    return JSON.stringify(inner)
  }
  return typeof value === "string" ? value : JSON.stringify(value)
}

/** True for a single tagged value `{ type, value }` rather than a facet/side map. */
function isTaggedValue(value: unknown): boolean {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "type" in (value as object)
  )
}

/**
 * Flattens one property entry to `label: value` strings that match how the facet
 * is shaped: a compound facet reads `font.style: italic`, a shorthand side reads
 * `padding: top: value`, a layered facet reads `background.color: value`, and an
 * atomic value reads `key: value`.
 */
function flattenChange(key: string, value: unknown): string[] {
  if (Array.isArray(value)) {
    const rows: string[] = []
    value.forEach((layer, index) => {
      if (!layer || typeof layer !== "object") return
      const prefix = value.length > 1 ? `${key}[${index}]` : key
      for (const [facet, facetValue] of Object.entries(
        layer as Record<string, unknown>,
      )) {
        rows.push(`${prefix}.${facet}: ${summarizeValue(facetValue)}`)
      }
    })
    return rows
  }

  if (value && typeof value === "object" && !isTaggedValue(value)) {
    const shorthand = getPropertyCategory(key) === "shorthand"
    return Object.entries(value as Record<string, unknown>).map(([sub, subValue]) =>
      shorthand
        ? `${key}: ${sub}: ${summarizeValue(subValue)}`
        : `${key}.${sub}: ${summarizeValue(subValue)}`,
    )
  }

  return [`${key}: ${summarizeValue(value)}`]
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
 * Builds the outcome block: for each target that changed, one line with its
 * ancestry path, then one line listing every property and value touched on it,
 * comma separated. Actions to the same target merge into one entry, and an
 * action with no property map lists its action type instead.
 */
export function describeChanges(
  workspace: Workspace,
  report: ApplyReport,
): string[] {
  const groups = new Map<string, WorkspaceAction[]>()
  for (const action of report.appliedActions) {
    const id = targetIdOf(action.payload) ?? ""
    const list = groups.get(id) ?? []
    list.push(action)
    groups.set(id, list)
  }

  const rows: string[] = []
  for (const [id, actions] of groups) {
    rows.push(targetPath(workspace, id || undefined))
    const changes: string[] = []
    for (const action of actions) {
      const props = changedProperties(action)
      if (props.length === 0) {
        changes.push(action.type)
        continue
      }
      for (const [key, value] of props) {
        changes.push(...flattenChange(key, value))
      }
    }
    rows.push(changes.join(", "))
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

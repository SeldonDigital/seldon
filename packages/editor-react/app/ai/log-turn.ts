import type { AgentDebug, AgentMetrics } from "@seldon/ai"
import type {
  BoardKey,
  Workspace,
  WorkspaceAction,
} from "@seldon/core/workspace/types"
import { useDebugStore } from "@app/editor/hooks/use-debug-mode"
import { changedProperties, targetIdWithParentOf } from "@seldon/editor/lib/ai/action-helpers"
import type { ApplyReport } from "@seldon/editor/lib/ai/apply-report"

/** Human-readable label/level for a target id, resolved as a node then a board. */
function describeTarget(workspace: Workspace, id: string | undefined): string {
  if (!id) return "(no target id)"
  const node = workspace.nodes?.[id]
  if (node) {
    const label = node.label ? ` "${node.label}"` : ""
    return `${id}${label} [${node.level}]`
  }
  const board = workspace.boards?.[id]
  if (board) return `${id} "${board.label}" [board]`
  return `${id} (not found)`
}

/** Compact serialization of a tagged property value. */
function summarizeValue(value: unknown): string {
  if (value && typeof value === "object" && "type" in value) {
    const tagged = value as { type?: unknown; value?: unknown }
    return `${String(tagged.type)}:${JSON.stringify(tagged.value)}`
  }
  const json = JSON.stringify(value)
  return json && json.length > 60 ? `${json.slice(0, 60)}…` : String(json)
}

/** Purple badge that prefixes every seldon/ai console row, matching seldon/core. */
const AI_TAG = "%c[seldon/ai]%c"
const AI_TAG_STYLE = "color:#a855f7;font-weight:bold"

/** Opens a collapsed group whose header carries the purple [seldon/ai] badge. */
function aiGroup(title: string): void {
  console.groupCollapsed(`${AI_TAG} ${title}`, AI_TAG_STYLE, "")
}

/** Logs a row prefixed with the purple [seldon/ai] badge, plus any extra args. */
function aiLog(message: string, ...args: unknown[]): void {
  console.log(`${AI_TAG} ${message}`, AI_TAG_STYLE, "", ...args)
}

/** Logs one applied action's target header and each property's before -> after. */
function logActionChange(
  before: Workspace,
  after: Workspace,
  action: WorkspaceAction,
): void {
  const id = targetIdWithParentOf(action.payload)
  aiLog(`${action.type} → ${describeTarget(after, id)}`)
  const overrides = id
    ? (before.nodes?.[id]?.overrides as Record<string, unknown> | undefined)
    : undefined
  for (const [key, nextValue] of changedProperties(action)) {
    const previous = overrides?.[key]
    aiLog(
      `    ${key}: ${summarizeValue(previous)} → ${summarizeValue(nextValue)}`,
    )
  }
}

/**
 * Logs a focused "what changed" subsection: each applied action's target id,
 * label, and level so the object is identifiable in the editor, plus the
 * before -> after value of each property it set.
 */
function logChanges(
  before: Workspace,
  after: Workspace,
  appliedActions: WorkspaceAction[],
): void {
  if (appliedActions.length === 0) return
  aiGroup("🎯 Changed")
  for (const action of appliedActions) {
    logActionChange(before, after, action)
  }
  console.groupEnd()
}

/** Collects the node ids reachable from a component board's variant trees. */
function collectBoardNodeIds(
  refs: { id: string; children?: unknown[] }[] | undefined,
  ids: Set<string>,
): void {
  if (!refs) return
  for (const ref of refs) {
    ids.add(ref.id)
    collectBoardNodeIds(
      ref.children as { id: string; children?: unknown[] }[] | undefined,
      ids,
    )
  }
}

/**
 * Narrows a workspace to the node entries the AI was grounded on: those reachable
 * from the active board's variant trees. Returns the full workspace unchanged
 * when no active board resolves, since the turn's scope is then the whole file.
 */
function scopeToBoard(
  workspace: Workspace,
  activeBoardKey: BoardKey | undefined,
): Pick<Workspace, "nodes"> | Workspace {
  const board = activeBoardKey ? workspace.boards[activeBoardKey] : undefined
  if (!board || board.type !== "component") return workspace
  const ids = new Set<string>()
  collectBoardNodeIds(board.variants, ids)
  const nodes: Workspace["nodes"] = {}
  for (const id of ids) {
    const node = workspace.nodes[id]
    if (node) nodes[id] = node
  }
  return { nodes }
}

/** Formats a byte count as GB or MB, or undefined when the count is missing. */
function formatBytes(bytes: number | undefined): string | undefined {
  if (!bytes || bytes <= 0) return undefined
  const gb = bytes / 1e9
  return gb >= 1 ? `${gb.toFixed(2)} GB` : `${(bytes / 1e6).toFixed(0)} MB`
}

/** Formats an integer with thousands separators, e.g. 6024 -> "6,024". */
function formatCount(value: number): string {
  return value.toLocaleString("en-US")
}

/**
 * Logs a one-line performance summary for the turn: wall time, load time,
 * input/output tokens, generation speed, model memory, and call count. Times are
 * shown in seconds. Metrics are absent only when the agent could not read them,
 * so the line is skipped.
 */
function logMetricsSummary(metrics: AgentMetrics | undefined): void {
  if (!metrics) return
  const parts: string[] = [`${(metrics.totalMs / 1000).toFixed(2)} s total`]
  if (metrics.firstTokenMs !== undefined) {
    parts.push(`${(metrics.firstTokenMs / 1000).toFixed(2)} s to first token`)
  }
  if (metrics.loadMs > 0) {
    parts.push(`${(metrics.loadMs / 1000).toFixed(2)} s load`)
  }
  parts.push(
    `${formatCount(metrics.promptTokens)} tokens input / ${formatCount(metrics.outputTokens)} tokens output`,
  )
  if (metrics.outputTokensPerSecond) {
    parts.push(`${metrics.outputTokensPerSecond.toFixed(1)} tokens/second`)
  }
  const vram = formatBytes(metrics.modelVramBytes)
  const size = formatBytes(metrics.modelSizeBytes)
  if (vram) parts.push(`${vram} VRAM`)
  else if (size) parts.push(`${size} loaded`)
  if (metrics.calls > 1) parts.push(`${metrics.calls} calls`)
  aiLog(`⏱ ${metrics.model} · ${parts.join(" · ")}`, metrics)
}

/**
 * Ordered section anchors in the grounding context. Each entry labels a section
 * by the line that starts it. Lines are attributed to the current section until
 * the next anchor, so multi-line blocks like the node trees roll up correctly.
 */
const CONTEXT_SECTION_ANCHORS: { label: string; startsWith: string }[] = [
  { label: "Active board", startsWith: "Active board:" },
  { label: "Selection subtree", startsWith: "Selection subtree" },
  { label: "Variant tree", startsWith: "Active variant" },
  { label: "Board trees", startsWith: "Node trees per variant" },
  { label: "Workspace boards", startsWith: "Workspace boards" },
  { label: "Resource entries", startsWith: "Resource board entries" },
  { label: "Selection", startsWith: "Selected node:" },
  { label: "Property vocabulary", startsWith: "Property vocabulary" },
  { label: "Property value shapes", startsWith: "Property value shapes" },
  { label: "Settable values", startsWith: "Settable values" },
  { label: "Hierarchy", startsWith: "Hierarchy (level" },
  { label: "Theme ids", startsWith: "Theme ids" },
  { label: "Theme tokens", startsWith: "Theme tokens" },
  { label: "Catalog ids", startsWith: "Component catalog ids" },
]

/**
 * Attributes the grounding context's characters to its sections and logs a size
 * breakdown, so trimming targets the heaviest dynamic parts by measured weight
 * on the real board. Token counts are a rough chars/4 estimate.
 */
function logContextSizes(context: string): void {
  const buckets = new Map<string, number>()
  let current = "Header"
  for (const line of context.split("\n")) {
    const trimmed = line.trimStart()
    const anchor = CONTEXT_SECTION_ANCHORS.find((entry) =>
      trimmed.startsWith(entry.startsWith),
    )
    if (anchor) current = anchor.label
    buckets.set(current, (buckets.get(current) ?? 0) + line.length + 1)
  }
  const rows = [...buckets.entries()]
    .map(([label, chars]) => ({
      section: label,
      chars,
      approxTokens: Math.round(chars / 4),
    }))
    .sort((a, b) => b.chars - a.chars)
  aiGroup(
    `📏 Context size · ${formatCount(context.length)} chars (~${formatCount(
      Math.round(context.length / 4),
    )} tokens)`,
  )
  console.table(rows)
  console.groupEnd()
}

/** True when AI Logging is on in the Dev menu. */
export function isLoggingEnabled(): boolean {
  return useDebugStore.getState().aiLogging
}

/**
 * Logs a one-line warm-up summary when the panel loads the model ahead of the
 * first turn: model load time, tokens prefilled, and memory. Gated by AI Logging.
 */
export function logWarm(metrics: AgentMetrics): void {
  const parts = [
    `${(metrics.loadMs / 1000).toFixed(2)} s load`,
    `${formatCount(metrics.promptTokens)} tokens prefilled`,
  ]
  const vram = formatBytes(metrics.modelVramBytes)
  if (vram) parts.push(`${vram} VRAM`)
  aiLog(`🔥 Warmed ${metrics.model} · ${parts.join(" · ")}`, metrics)
}

/**
 * Emits one collapsed console group per turn when AI Logging is enabled. Groups
 * keep the console tidy: the summary line shows collapsed, and the grounding
 * context and raw model response are nested groups the user can expand on
 * demand.
 */
/** The single-glyph outcome badge for the turn header. */
function outcomeIcon(report: ApplyReport): string {
  if (report.rejected.length > 0) return "❌"
  if (report.applied.length === 0 && report.ineffective.length > 0) return "⚠️"
  if (report.applied.length > 0) return "✅"
  return "➖"
}

/** Logs a board-scoped workspace snapshot under a titled group, with the full file nested. */
function logWorkspaceSnapshot(
  title: string,
  workspace: Workspace,
  activeBoardKey: BoardKey | undefined,
): void {
  aiGroup(title)
  console.log(scopeToBoard(workspace, activeBoardKey))
  console.groupCollapsed("Full workspace")
  console.log(workspace)
  console.groupEnd()
  console.groupEnd()
}

/** Logs the grounding context, its size breakdown, the raw reply, and any repairs. */
function logDebug(debug: AgentDebug): void {
  aiGroup("🧭 Context")
  console.log(debug.context)
  console.groupEnd()
  logContextSizes(debug.context)
  aiGroup("📥 Raw model response")
  console.log(debug.rawResponse)
  console.groupEnd()
  const repairs = debug.repairs ?? []
  if (repairs.length === 0) return
  aiGroup(`🔧 Shape repairs (${repairs.length})`)
  for (const repair of repairs) {
    aiLog(`${repair.actionType}.${repair.propertyKey}: ${repair.reason}`)
  }
  console.groupEnd()
}

/** Logs the parsed action types, the per-target change detail, and the outcome badge. */
function logActionsAndOutcome(
  before: Workspace,
  actions: WorkspaceAction[],
  report: ApplyReport,
): void {
  aiLog(
    "⚙️ Parsed actions",
    actions.map((action) => action.type),
    actions,
  )
  logChanges(before, report.workspace, report.appliedActions)
  aiLog(`${outcomeIcon(report)} Outcome`, {
    applied: report.applied,
    ineffective: report.ineffective,
    rejected: report.rejected,
  })
}

export function logAiTurn(
  message: string,
  debug: AgentDebug | undefined,
  actions: WorkspaceAction[],
  report: ApplyReport,
  before: Workspace,
  activeBoardKey: BoardKey | undefined,
): void {
  if (!isLoggingEnabled()) return

  console.groupCollapsed(`${AI_TAG} 💬 ${message}`, AI_TAG_STYLE, "")
  logWorkspaceSnapshot("🗂 Workspace before", before, activeBoardKey)
  if (debug) logDebug(debug)
  logActionsAndOutcome(before, actions, report)
  logWorkspaceSnapshot("🗂 Workspace after", report.workspace, activeBoardKey)
  if (debug) logMetricsSummary(debug.metrics)
  console.groupEnd()
}

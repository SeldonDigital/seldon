import { useCallback } from "react"
import { create } from "zustand"
import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import type {
  BoardKey,
  Workspace,
  WorkspaceAction,
} from "@seldon/core/workspace/types"
import type { AgentDebug } from "@seldon/ai"
import { runAgentChat } from "@lib/ai/run-agent-chat"
import { useDebugStore } from "@lib/hooks/use-debug-mode"
import { useActiveBoard } from "@lib/workspace/hooks/use-active-board"
import { useDispatch } from "@lib/workspace/hooks/use-dispatch"
import { getCurrentWorkspace } from "@lib/workspace/hooks/use-history"
import { useStore as useSelectionStore } from "@lib/workspace/hooks/use-selection"
import { useDialog } from "./use-dialog"

export type AiChatRole = "user" | "assistant"

export interface AiChatMessage {
  role: AiChatRole
  content: string
}

export type AiChatStatus = "idle" | "pending" | "error"

interface AiChatState {
  messages: AiChatMessage[]
  status: AiChatStatus
  error: string | null
  addMessage: (message: AiChatMessage) => void
  setStatus: (status: AiChatStatus) => void
  setError: (error: string | null) => void
  reset: () => void
}

const useStore = create<AiChatState>((set) => ({
  messages: [],
  status: "idle",
  error: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  reset: () => set({ messages: [], status: "idle", error: null }),
}))

/** Finds the board map key for the currently active board, if any. */
function findActiveBoardKey(
  workspace: Workspace,
  activeBoard: Workspace["boards"][BoardKey] | null,
): BoardKey | undefined {
  if (!activeBoard) return undefined
  return Object.keys(workspace.boards).find(
    (key) => workspace.boards[key] === activeBoard,
  )
}

interface RejectedAction {
  type: string
  reason: string
}

interface ApplyReport {
  workspace: Workspace
  applied: string[]
  ineffective: string[]
  rejected: RejectedAction[]
  /** Actions that produced a real change, kept for the console change summary. */
  appliedActions: WorkspaceAction[]
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
function applyActionsWithReport(
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
  const target = bag.target
  if (target && typeof target === "object") {
    const parentId = (target as Record<string, unknown>).parentId
    if (typeof parentId === "string") return parentId
  }
  return undefined
}

/** Human-readable label/level for a target id, resolved as a node then a board. */
function describeTarget(
  workspace: Workspace,
  id: string | undefined,
): string {
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

/** The property key/value pairs an action sets, if any. */
function changedProperties(action: WorkspaceAction): [string, unknown][] {
  const payload = (action as { payload?: unknown }).payload
  if (!payload || typeof payload !== "object") return []
  const properties = (payload as Record<string, unknown>).properties
  if (!properties || typeof properties !== "object") return []
  return Object.entries(properties as Record<string, unknown>)
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
  console.groupCollapsed("🎯 Changed")
  for (const action of appliedActions) {
    const id = targetIdOf(action.payload)
    console.log(`${action.type} → ${describeTarget(after, id)}`)
    for (const [key, nextValue] of changedProperties(action)) {
      const overrides = id
        ? (before.nodes?.[id]?.overrides as
            | Record<string, unknown>
            | undefined)
        : undefined
      const previous = overrides?.[key]
      console.log(
        `    ${key}: ${summarizeValue(previous)} → ${summarizeValue(nextValue)}`,
      )
    }
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

/**
 * Emits one collapsed console group per turn when AI Logging is enabled in the
 * Dev menu. Groups keep the console tidy: the summary line shows collapsed, and
 * the grounding context and raw model response are nested groups the user can
 * expand on demand.
 */
function logAiTurn(
  message: string,
  debug: AgentDebug | undefined,
  actions: WorkspaceAction[],
  report: ApplyReport,
  before: Workspace,
  activeBoardKey: BoardKey | undefined,
): void {
  if (!useDebugStore.getState().aiLogging) return

  const outcomeIcon =
    report.rejected.length > 0
      ? "❌"
      : report.applied.length === 0 && report.ineffective.length > 0
        ? "⚠️"
        : report.applied.length > 0
          ? "✅"
          : "➖"

  console.groupCollapsed(
    `%c[seldon/ai]%c 💬 ${message}`,
    "color:#a855f7;font-weight:bold",
    "",
  )
  if (debug) {
    console.groupCollapsed("🧭 Grounding context")
    console.log(debug.context)
    console.groupEnd()
    console.groupCollapsed("📥 Raw model response")
    console.log(debug.rawResponse)
    console.groupEnd()
  }
  console.log(
    "⚙️ Parsed actions",
    actions.map((action) => action.type),
    actions,
  )
  logChanges(before, report.workspace, report.appliedActions)
  console.groupCollapsed("🗂 Workspace before")
  console.log(scopeToBoard(before, activeBoardKey))
  console.groupCollapsed("Full workspace")
  console.log(before)
  console.groupEnd()
  console.groupEnd()
  console.log(`${outcomeIcon} Outcome`, {
    applied: report.applied,
    ineffective: report.ineffective,
    rejected: report.rejected,
  })
  console.groupCollapsed("🗂 Workspace after")
  console.log(scopeToBoard(report.workspace, activeBoardKey))
  console.groupCollapsed("Full workspace")
  console.log(report.workspace)
  console.groupEnd()
  console.groupEnd()
  console.groupEnd()
}

/** Builds the assistant transcript line from the model reply and apply report. */
function formatOutcome(reply: string, report: ApplyReport): string {
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

/**
 * Chat state plus the send loop. `send` posts the message and current workspace
 * to the local agent, then folds the returned actions through the reducer with
 * one `set_workspace` dispatch, so the whole turn is a single undo step. A
 * validation failure leaves the workspace unchanged and surfaces in the chat.
 */
export function useAiChat() {
  const { activeDialog, openDialog, closeDialog } = useDialog()
  const dispatch = useDispatch()
  const { activeBoard } = useActiveBoard()

  const messages = useStore((state) => state.messages)
  const status = useStore((state) => state.status)
  const error = useStore((state) => state.error)

  const send = useCallback(
    async (rawMessage: string) => {
      const message = rawMessage.trim()
      if (!message) return

      const store = useStore.getState()
      const history = store.messages
      store.addMessage({ role: "user", content: message })
      store.setStatus("pending")
      store.setError(null)

      try {
        const current = getCurrentWorkspace()
        const activeBoardKey = findActiveBoardKey(current, activeBoard)
        const { selectedNodeId, selectedNodeRootId } =
          useSelectionStore.getState()

        const { actions, reply, debug } = await runAgentChat({
          workspace: current,
          message,
          history,
          activeBoardKey,
          selectedNodeId: selectedNodeId ?? undefined,
          selectedNodeRootId: selectedNodeRootId ?? undefined,
        })

        const outcome = applyActionsWithReport(current, actions)
        logAiTurn(message, debug, actions, outcome, current, activeBoardKey)

        if (outcome.applied.length > 0) {
          dispatch({
            type: "set_workspace",
            payload: { workspace: outcome.workspace },
          })
        }

        useStore.getState().addMessage({
          role: "assistant",
          content: formatOutcome(reply, outcome),
        })
        useStore
          .getState()
          .setStatus(
            outcome.rejected.length > 0 && outcome.applied.length === 0
              ? "error"
              : "idle",
          )
      } catch (caught) {
        const messageText =
          caught instanceof Error ? caught.message : "Agent request failed."
        useStore.getState().addMessage({
          role: "assistant",
          content: `Error: ${messageText}`,
        })
        useStore.getState().setStatus("error")
        useStore.getState().setError(messageText)
      }
    },
    [activeBoard, dispatch],
  )

  const reset = useStore((state) => state.reset)

  return {
    isOpen: activeDialog === "ai-chat",
    open: () => openDialog("ai-chat"),
    close: closeDialog,
    messages,
    status,
    error,
    send,
    reset,
  }
}

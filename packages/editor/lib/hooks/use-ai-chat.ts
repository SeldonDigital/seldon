import { useCallback } from "react"
import { create } from "zustand"
import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import type {
  BoardKey,
  Workspace,
  WorkspaceAction,
} from "@seldon/core/workspace/types"
import { runAgentChat } from "@lib/ai/run-agent-chat"
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

  for (const action of actions) {
    try {
      const next = applyActions(workspace, [action])
      if (isUnchanged(workspace, next)) {
        ineffective.push(action.type)
      } else {
        applied.push(action.type)
        workspace = next
      }
    } catch (caught) {
      rejected.push({
        type: action.type,
        reason: caught instanceof Error ? caught.message : "invalid action",
      })
    }
  }

  return { workspace, applied, ineffective, rejected }
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

        const { actions, reply } = await runAgentChat({
          workspace: current,
          message,
          history,
          activeBoardKey,
          selectedNodeId: selectedNodeId ?? undefined,
          selectedNodeRootId: selectedNodeRootId ?? undefined,
        })

        const outcome = applyActionsWithReport(current, actions)

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

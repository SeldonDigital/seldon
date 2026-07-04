import { useCallback } from "react"
import { create } from "zustand"
import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import type { BoardKey, Workspace } from "@seldon/core/workspace/types"
import { runAgentChat } from "@lib/ai/run-agent-chat"
import { useActiveBoard } from "@lib/workspace/hooks/use-active-board"
import { useDispatch } from "@lib/workspace/hooks/use-dispatch"
import { getCurrentWorkspace } from "@lib/workspace/hooks/use-history"
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

        const { actions, reply } = await runAgentChat({
          workspace: current,
          message,
          history,
          activeBoardKey,
        })

        if (actions.length > 0) {
          const next = applyActions(current, actions)
          dispatch({ type: "set_workspace", payload: { workspace: next } })
        }

        useStore.getState().addMessage({
          role: "assistant",
          content: reply || "Done.",
        })
        useStore.getState().setStatus("idle")
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

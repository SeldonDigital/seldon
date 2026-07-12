import {
  type AgentConfig,
  getAgentConfig,
  runAgentChat,
  warmAgent,
} from "@lib/ai/run-agent-chat"
import type { ThinkingLevelOption } from "@seldon/ai"
import { useCallback } from "react"
import { create } from "zustand"
import { useActiveBoard } from "@lib/workspace/hooks/use-active-board"
import { useDispatch } from "@lib/workspace/hooks/use-dispatch"
import { getCurrentWorkspace } from "@lib/workspace/hooks/use-history"
import { useStore as useSelectionStore } from "@lib/workspace/hooks/use-selection"
import {
  applyActionsWithReport,
  findActiveBoardKey,
  formatOutcome,
} from "./ai-chat/apply-report"
import { isLoggingEnabled, logAiTurn, logWarm } from "./ai-chat/log-turn"
import { usePanel } from "./use-panel"

export type AiChatRole = "user" | "assistant"

export interface AiChatMessage {
  role: AiChatRole
  content: string
}

export type HariStatus = "idle" | "pending" | "error"

interface AiChatState {
  messages: AiChatMessage[]
  status: HariStatus
  error: string | null
  /** Session-config choices from the agent, loaded when the panel opens. */
  config: AgentConfig | null
  /** Selected model and thinking level for the next turn. */
  model?: string
  thinkingLevel?: ThinkingLevelOption
  addMessage: (message: AiChatMessage) => void
  setStatus: (status: HariStatus) => void
  setError: (error: string | null) => void
  setConfig: (config: AgentConfig) => void
  setModel: (model: string) => void
  setThinkingLevel: (thinkingLevel: ThinkingLevelOption) => void
  reset: () => void
}

const useStore = create<AiChatState>((set) => ({
  messages: [],
  status: "idle",
  error: null,
  config: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setConfig: (config) =>
    set((state) => ({
      config,
      model: state.model ?? config.defaults.model,
      thinkingLevel: state.thinkingLevel ?? config.defaults.thinkingLevel,
    })),
  setModel: (model) => set({ model }),
  setThinkingLevel: (thinkingLevel) => set({ thinkingLevel }),
  reset: () => set({ messages: [], status: "idle", error: null }),
}))

/**
 * Coalesces concurrent warm-up requests so overlapping callers share one
 * request and one log. Cleared on completion, so reopening the panel later
 * re-warms if the model has since been evicted. Also absorbs StrictMode's
 * double effect invocation in dev.
 */
let warmInFlight: Promise<void> | null = null

/**
 * Chat state plus the send loop. `send` posts the message and current workspace
 * to the local agent, then folds the returned actions through the reducer with
 * one `set_workspace` dispatch, so the whole turn is a single undo step. A
 * validation failure leaves the workspace unchanged and surfaces in the chat.
 */
export function useHari() {
  const { activePanel, openPanel, closePanel } = usePanel()
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
      const { model, thinkingLevel } = store
      store.addMessage({ role: "user", content: message })
      store.setStatus("pending")
      store.setError(null)

      try {
        const current = getCurrentWorkspace()
        const activeBoardKey = findActiveBoardKey(current, activeBoard)
        const { selectedNodeId, selectedNodeRootId, selectedBoardId } =
          useSelectionStore.getState()

        const { actions, reply, debug } = await runAgentChat({
          workspace: current,
          message,
          history,
          activeBoardKey,
          selectedNodeId: selectedNodeId ?? undefined,
          selectedNodeRootId: selectedNodeRootId ?? undefined,
          selectedBoardId: selectedBoardId ?? undefined,
          model,
          thinkingLevel,
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

  const warm = useCallback(() => {
    if (warmInFlight) return warmInFlight
    warmInFlight = (async () => {
      try {
        const config = await getAgentConfig()
        if (config) useStore.getState().setConfig(config)
        const { model } = useStore.getState()
        const { metrics } = await warmAgent({ model })
        if (isLoggingEnabled()) logWarm(metrics)
      } catch {
        // Warm-up is best-effort; a failure just means the first turn loads cold.
      } finally {
        warmInFlight = null
      }
    })()
    return warmInFlight
  }, [])

  const reset = useStore((state) => state.reset)

  const config = useStore((state) => state.config)
  const model = useStore((state) => state.model)
  const thinkingLevel = useStore((state) => state.thinkingLevel)
  const setModel = useStore((state) => state.setModel)
  const setThinkingLevel = useStore((state) => state.setThinkingLevel)

  return {
    isOpen: activePanel === "ai-chat",
    open: () => openPanel("ai-chat"),
    close: closePanel,
    messages,
    status,
    error,
    send,
    warm,
    reset,
    config,
    model,
    thinkingLevel,
    setModel,
    setThinkingLevel,
  }
}

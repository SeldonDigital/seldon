import {
  type AgentConfig,
  getAgentConfig,
  runAgentChat,
  warmAgent,
} from "@lib/ai/run-agent-chat"
import type {
  AgentStreamEvent,
  AgentToolCall,
  ThinkingLevelOption,
} from "@seldon/ai"
import { useCallback } from "react"
import { create } from "zustand"
import { useActiveBoard } from "@lib/workspace/hooks/use-active-board"
import { useDispatch } from "@lib/workspace/hooks/use-dispatch"
import { getCurrentWorkspace } from "@lib/workspace/hooks/use-history"
import { useStore as useSelectionStore } from "@lib/workspace/hooks/use-selection"
import {
  getResourceTargetId,
  getSelectionScope,
} from "@lib/workspace/hooks/use-selection-scope"
import {
  type RejectedAction,
  applyActionsWithReport,
  describeChanges,
  findActiveBoardKey,
} from "./ai-chat/apply-report"
import { isLoggingEnabled, logAiTurn, logWarm } from "./ai-chat/log-turn"
import { useDebugStore } from "./use-debug-mode"
import { usePanel } from "./use-panel"

export type AiChatRole = "user" | "assistant"

export interface AiChatMessage {
  role: AiChatRole
  content: string
}

export type HariStatus = "idle" | "pending" | "error"

/** Per-turn lifecycle, used to pick the transcript block for the last turn. */
export type TurnStatus = "pending" | "done" | "error"

/**
 * One chat turn's structured record. The transcript renders each populated
 * field as its own message block: the prompt, the model's reasoning, the tools
 * it called, the applied changes, the model reply, and any rejection or error.
 */
export interface HariTurn {
  id: string
  prompt: string
  status: TurnStatus
  thinking?: string
  /** Wall time the model spent thinking, in ms. Set marks the thinking done. */
  thinkingMs?: number
  toolCalls?: AgentToolCall[]
  reply?: string
  changes?: string[]
  rejected?: RejectedAction[]
  error?: string
}

interface AiChatState {
  turns: HariTurn[]
  status: HariStatus
  error: string | null
  /** Session-config choices from the agent, loaded when the panel opens. */
  config: AgentConfig | null
  /** Selected model and thinking level for the next turn. */
  model?: string
  thinkingLevel?: ThinkingLevelOption
  startTurn: (prompt: string) => string
  updateTurn: (id: string, patch: Partial<HariTurn>) => void
  mutateTurn: (id: string, update: (turn: HariTurn) => HariTurn) => void
  setStatus: (status: HariStatus) => void
  setError: (error: string | null) => void
  setConfig: (config: AgentConfig) => void
  setModel: (model: string) => void
  setThinkingLevel: (thinkingLevel: ThinkingLevelOption) => void
  reset: () => void
}

let turnSequence = 0

const useStore = create<AiChatState>((set) => ({
  turns: [],
  status: "idle",
  error: null,
  config: null,
  startTurn: (prompt) => {
    const id = `turn-${(turnSequence += 1)}`
    set((state) => ({
      turns: [...state.turns, { id, prompt, status: "pending" }],
      status: "pending",
      error: null,
    }))
    return id
  },
  updateTurn: (id, patch) =>
    set((state) => ({
      turns: state.turns.map((turn) =>
        turn.id === id ? { ...turn, ...patch } : turn,
      ),
    })),
  mutateTurn: (id, update) =>
    set((state) => ({
      turns: state.turns.map((turn) => (turn.id === id ? update(turn) : turn)),
    })),
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
  reset: () => set({ turns: [], status: "idle", error: null }),
}))

/**
 * Folds one streamed event into the live turn: appends reasoning and reply
 * text, records tool calls and their status, and marks the thinking done with
 * its elapsed time. The final `done` result overwrites these with the
 * authoritative values, so drift during streaming self-corrects.
 */
function applyTurnEvent(turnId: string, event: AgentStreamEvent): void {
  const { mutateTurn } = useStore.getState()
  switch (event.type) {
    case "thinking":
      mutateTurn(turnId, (turn) => ({
        ...turn,
        thinking: (turn.thinking ?? "") + event.delta,
      }))
      break
    case "thinkingDone":
      mutateTurn(turnId, (turn) => ({ ...turn, thinkingMs: event.ms }))
      break
    case "text":
      mutateTurn(turnId, (turn) => ({
        ...turn,
        reply: (turn.reply ?? "") + event.delta,
      }))
      break
    case "tool":
      mutateTurn(turnId, (turn) => ({
        ...turn,
        toolCalls: [...(turn.toolCalls ?? []), { name: event.name, ok: true }],
      }))
      break
    case "toolResult":
      mutateTurn(turnId, (turn) => {
        const toolCalls = [...(turn.toolCalls ?? [])]
        const last = toolCalls[toolCalls.length - 1]
        if (last) toolCalls[toolCalls.length - 1] = { ...last, ok: event.ok }
        return { ...turn, toolCalls }
      })
      break
  }
}

/** Flattens completed turns into the role/content history the agent expects. */
function buildHistory(turns: HariTurn[]): AiChatMessage[] {
  const history: AiChatMessage[] = []
  for (const turn of turns) {
    history.push({ role: "user", content: turn.prompt })
    if (turn.reply) history.push({ role: "assistant", content: turn.reply })
  }
  return history
}

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

  const turns = useStore((state) => state.turns)
  const status = useStore((state) => state.status)
  const error = useStore((state) => state.error)

  const send = useCallback(
    async (rawMessage: string) => {
      const message = rawMessage.trim()
      if (!message) return

      const store = useStore.getState()
      const history = buildHistory(store.turns)
      const { model, thinkingLevel } = store
      const turnId = store.startTurn(message)

      try {
        const current = getCurrentWorkspace()
        const activeBoardKey = findActiveBoardKey(current, activeBoard)
        const { selectedNodeId, selectedNodeRootId, selectedBoardId } =
          useSelectionStore.getState()
        const scope = getSelectionScope(current)
        const resourceTargetId = getResourceTargetId(current)

        const { actions, reply, debug } = await runAgentChat(
          {
            workspace: current,
            message,
            history,
            activeBoardKey,
            selectedNodeId: selectedNodeId ?? undefined,
            selectedNodeRootId: selectedNodeRootId ?? undefined,
            selectedBoardId: selectedBoardId ?? undefined,
            scope,
            resourceTargetId,
            model,
            thinkingLevel,
            noThink: useDebugStore.getState().noThink,
          },
          (event) => applyTurnEvent(turnId, event),
        )

        const outcome = applyActionsWithReport(current, actions)
        logAiTurn(message, debug, actions, outcome, current, activeBoardKey)

        if (outcome.applied.length > 0) {
          dispatch({
            type: "set_workspace",
            payload: { workspace: outcome.workspace },
          })
        }

        const failed =
          outcome.rejected.length > 0 && outcome.applied.length === 0
        useStore.getState().updateTurn(turnId, {
          thinking: debug.thinking,
          thinkingMs: debug.thinkingMs,
          toolCalls: debug.toolCalls,
          reply,
          changes: describeChanges(outcome.workspace, outcome),
          rejected: outcome.rejected.length > 0 ? outcome.rejected : undefined,
          status: failed ? "error" : "done",
        })
        useStore.getState().setStatus(failed ? "error" : "idle")
      } catch (caught) {
        const messageText =
          caught instanceof Error ? caught.message : "Agent request failed."
        useStore
          .getState()
          .updateTurn(turnId, { error: messageText, status: "error" })
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
    turns,
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

import {
  type AgentConfig,
  getAgentConfig,
  runAgentChat,
  warmAgent,
} from "@lib/ai/run-agent-chat"
import type {
  ActionRepair,
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
  buildTurnReport,
  findActiveBoardKey,
} from "./ai-chat/apply-report"
import { describeChanges } from "./ai-chat/change-summary"
import { checkTurnIntegrity } from "./ai-chat/check-turn-integrity"
import { isLoggingEnabled, logAiTurn, logWarm } from "./ai-chat/log-turn"
import { collectVocabularyWarnings } from "./ai-chat/vocabulary-warnings"
import { useDebugStore } from "./use-debug-mode"
import { usePanel } from "./use-panel"

export type AiChatRole = "user" | "assistant"

export interface AiChatMessage {
  role: AiChatRole
  content: string
}

export type HariStatus = "idle" | "pending" | "error"

/** Per-turn lifecycle, used to pick the transcript block for the last turn. */
export type TurnStatus = "pending" | "done" | "error" | "stopped"

/**
 * The reducer-truth result of a turn, independent of the model's reply prose.
 * `applied` had at least one accepted change, `ineffective` only had edits that
 * matched nothing, and `none` produced no edit at all. The transcript renders
 * this so a reply can never read as a success the workspace never took.
 */
export type TurnOutcome = "applied" | "ineffective" | "none"

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
  /** True when reasoning was clamped off for this turn. */
  clamped?: boolean
  toolCalls?: AgentToolCall[]
  reply?: string
  /** Reducer-truth outcome badge, set apart from the reply so a no-op is visible. */
  outcome?: TurnOutcome
  changes?: string[]
  /** Deterministic shape fixes applied to the model's values before validation. */
  repairs?: ActionRepair[]
  /** Set keys or option values a component cannot take, so the edit is silently dropped. */
  warnings?: string[]
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
 * Clears the chat transcript from outside the panel, such as a menu action,
 * without subscribing the caller to the streaming state the panel watches.
 */
export function resetChat(): void {
  useStore.getState().reset()
}

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
 * The in-flight turn's abort controller, so the Stop button can cancel the
 * running turn. Aborting closes the request, which the server forwards to the Pi
 * session so the local model stops generating. Cleared when the turn settles.
 */
let activeController: AbortController | null = null

/** True for the abort error thrown when the user stops the turn. */
function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError"
}

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
      // The turn trusts the model's discovered capability over the server's
      // name check, so a newly installed thinking model reasons end to end.
      const mode = model
        ? store.config?.thinkingByModel?.[model]?.mode
        : undefined
      const thinkingCapable = mode === undefined ? undefined : mode !== "none"
      const turnId = store.startTurn(message)

      const controller = new AbortController()
      activeController = controller

      try {
        const current = getCurrentWorkspace()
        const activeBoardKey = findActiveBoardKey(current, activeBoard)
        const { selectedNodeId, selectedNodeRootId, selectedBoardId } =
          useSelectionStore.getState()
        const scope = getSelectionScope(current)
        const resourceTargetId = getResourceTargetId(current)
        const noThink = useDebugStore.getState().noThink

        const { actions, workspace, reply, ineffective, rejected, debug } =
          await runAgentChat(
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
              thinkingCapable,
              noThink,
            },
            (event) => applyTurnEvent(turnId, event),
            controller.signal,
          )

        const report = buildTurnReport(
          workspace,
          actions,
          ineffective,
          rejected,
        )
        logAiTurn(message, debug, actions, report, current, activeBoardKey)

        // Records an error turn and stops. Used when the turn built a workspace
        // we refuse to adopt, so a bad turn surfaces plainly and never lands.
        const failTurn = (reason: string) => {
          useStore.getState().updateTurn(turnId, {
            thinking: debug.thinking,
            thinkingMs: debug.thinkingMs,
            clamped: noThink,
            toolCalls: debug.toolCalls,
            reply,
            error: reason,
            status: "error",
          })
          useStore.getState().setStatus("error")
          useStore.getState().setError(reason)
        }

        // Adopt the workspace the agent built as one undo step, but only when it
        // is safe. The integrity check catches a mutation that dropped an id it
        // should not have, and the dispatch runs the store's verification, which
        // throws on a broken workspace. Either failure keeps the current state.
        if (report.applied.length > 0) {
          const integrity = checkTurnIntegrity(current, workspace, actions)
          if (!integrity.ok) {
            failTurn(
              `Change discarded to protect the workspace: ${integrity.reason}.`,
            )
            return
          }
          try {
            dispatch({ type: "set_workspace", payload: { workspace } })
          } catch (caught) {
            failTurn(
              caught instanceof Error
                ? `Change rejected by the workspace: ${caught.message}`
                : "The workspace change was rejected.",
            )
            return
          }
        }

        const failed = report.rejected.length > 0 && report.applied.length === 0
        const turnOutcome: TurnOutcome =
          report.applied.length > 0
            ? "applied"
            : report.ineffective.length > 0
              ? "ineffective"
              : "none"
        const warnings = collectVocabularyWarnings(current, actions)
        useStore.getState().updateTurn(turnId, {
          thinking: debug.thinking,
          thinkingMs: debug.thinkingMs,
          clamped: noThink,
          toolCalls: debug.toolCalls,
          reply,
          outcome: turnOutcome,
          changes: describeChanges(report.workspace, report),
          repairs: debug.repairs.length > 0 ? debug.repairs : undefined,
          warnings: warnings.length > 0 ? warnings : undefined,
          rejected: report.rejected.length > 0 ? report.rejected : undefined,
          status: failed ? "error" : "done",
        })
        useStore.getState().setStatus(failed ? "error" : "idle")
      } catch (caught) {
        if (isAbortError(caught)) {
          useStore.getState().updateTurn(turnId, { status: "stopped" })
          useStore.getState().setStatus("idle")
          return
        }
        const messageText =
          caught instanceof Error ? caught.message : "Agent request failed."
        useStore
          .getState()
          .updateTurn(turnId, { error: messageText, status: "error" })
        useStore.getState().setStatus("error")
        useStore.getState().setError(messageText)
      } finally {
        if (activeController === controller) activeController = null
      }
    },
    [activeBoard, dispatch],
  )

  const stop = useCallback(() => {
    activeController?.abort()
  }, [])

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
    stop,
    warm,
    reset,
    config,
    model,
    thinkingLevel,
    setModel,
    setThinkingLevel,
  }
}

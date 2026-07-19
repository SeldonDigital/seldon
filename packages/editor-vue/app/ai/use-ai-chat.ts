import { computed } from "vue"
import type { AgentStreamEvent } from "@seldon/ai"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import type { BoardKey, Workspace } from "@seldon/core/workspace/types"
import {
  getAgentConfig,
  runAgentChat,
  warmAgent,
} from "@seldon/editor/lib/ai/run-agent-chat"
import {
  buildTurnReport,
  findActiveBoardKey,
} from "@seldon/editor/lib/ai/apply-report"
import { checkTurnIntegrity } from "@seldon/editor/lib/ai/check-turn-integrity"
import { describeChanges } from "@seldon/editor/lib/ai/change-summary"
import { collectVocabularyWarnings } from "@seldon/editor/lib/ai/vocabulary-warnings"
import { resolveSelectionScope } from "@seldon/editor/lib/workspace/selection-scope"
import { getComponent } from "@seldon/editor/lib/workspace/workspace-accessors"
import {
  useAiChatStore,
  type HariTurn,
  type TurnOutcome,
} from "@app/stores/ai-chat-store"
import { useDebugStore } from "@app/stores/debug-store"
import { getCurrentWorkspace } from "@app/stores/history-store"
import { useSelectionStore } from "@app/stores/selection-store"
import { useDispatch } from "@app/workspace/use-dispatch"

type ChatMessage = { role: "user" | "assistant"; content: string }

/** Flattens completed turns into the role/content history the agent expects. */
function buildHistory(turns: HariTurn[]): ChatMessage[] {
  const history: ChatMessage[] = []
  for (const turn of turns) {
    history.push({ role: "user", content: turn.prompt })
    if (turn.reply) history.push({ role: "assistant", content: turn.reply })
  }
  return history
}

/** Resource entry id to edit for a theme/font/icon/media scope, or undefined. */
function resolveResourceTargetId(workspace: Workspace): string | undefined {
  const selection = useSelectionStore()
  if (selection.selectedResourceEntry) {
    return selection.selectedResourceEntry.id
  }
  if (selection.selectedResourceItemKey) {
    return selection.selectedResourceItemKey.split(":")[2] || undefined
  }
  if (selection.selectedBoardId) {
    const board = getComponent(workspace, selection.selectedBoardId)
    if (
      board &&
      (isThemeBoard(board) ||
        isFontCollectionBoard(board) ||
        isIconSetBoard(board) ||
        isMediaBoard(board))
    ) {
      return board.variants[0]?.id
    }
  }
  return undefined
}

/** Coalesces concurrent warm-up requests so overlapping callers share one. */
let warmInFlight: Promise<void> | null = null

/** The in-flight turn's abort controller, so Stop can cancel the running turn. */
let activeController: AbortController | null = null

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError"
}

/**
 * AI chat state plus the send loop for the Vue editor. `send` posts the message
 * and current workspace to the local agent, streams events into the live turn,
 * then adopts the workspace the agent built with one `set_workspace` dispatch so
 * the whole turn is a single undo step. Mirrors the React `useHari` behavior on
 * top of the shared agent runner and turn helpers.
 */
export function useAiChat() {
  const store = useAiChatStore()
  const debug = useDebugStore()
  const selection = useSelectionStore()
  const dispatch = useDispatch()

  function applyTurnEvent(turnId: string, event: AgentStreamEvent): void {
    switch (event.type) {
      case "thinking":
        store.mutateTurn(turnId, (turn) => ({
          ...turn,
          thinking: (turn.thinking ?? "") + event.delta,
        }))
        break
      case "thinkingDone":
        store.mutateTurn(turnId, (turn) => ({ ...turn, thinkingMs: event.ms }))
        break
      case "text":
        store.mutateTurn(turnId, (turn) => ({
          ...turn,
          reply: (turn.reply ?? "") + event.delta,
        }))
        break
      case "tool":
        store.mutateTurn(turnId, (turn) => ({
          ...turn,
          toolCalls: [...(turn.toolCalls ?? []), { name: event.name, ok: true }],
        }))
        break
      case "toolResult":
        store.mutateTurn(turnId, (turn) => {
          const toolCalls = [...(turn.toolCalls ?? [])]
          const last = toolCalls[toolCalls.length - 1]
          if (last) toolCalls[toolCalls.length - 1] = { ...last, ok: event.ok }
          return { ...turn, toolCalls }
        })
        break
    }
  }

  async function send(rawMessage: string): Promise<void> {
    const message = rawMessage.trim()
    if (!message) return

    const history = buildHistory(store.turns)
    const model = store.model
    const thinkingLevel = store.thinkingLevel
    const mode = model
      ? store.config?.thinkingByModel?.[model]?.mode
      : undefined
    const thinkingCapable = mode === undefined ? undefined : mode !== "none"
    const turnId = store.startTurn(message)

    const controller = new AbortController()
    activeController = controller

    try {
      const current = getCurrentWorkspace()
      const activeBoardKey = selection.selectedBoardId
        ? findActiveBoardKey(
            current,
            current.boards[selection.selectedBoardId as BoardKey],
          )
        : undefined
      const scope = resolveSelectionScope(
        {
          selectedNodeId: selection.selectedNodeId,
          selectedBoardId: selection.selectedBoardId,
          selectedResourceEntry: selection.selectedResourceEntry,
          selectedResourceItemKey: selection.selectedResourceItemKey,
          workspaceSelected: selection.workspaceSelected,
        },
        current,
      )
      const resourceTargetId = resolveResourceTargetId(current)
      const noThink = debug.noThink

      const { actions, workspace, reply, ineffective, rejected, debug: turnDebug } =
        await runAgentChat(
          {
            workspace: current,
            message,
            history,
            activeBoardKey,
            selectedNodeId: selection.selectedNodeId ?? undefined,
            selectedNodeRootId: selection.selectedNodeRootId ?? undefined,
            selectedBoardId: selection.selectedBoardId ?? undefined,
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

      const report = buildTurnReport(workspace, actions, ineffective, rejected)

      const failTurn = (reason: string): void => {
        store.updateTurn(turnId, {
          thinking: turnDebug.thinking,
          thinkingMs: turnDebug.thinkingMs,
          clamped: noThink,
          toolCalls: turnDebug.toolCalls,
          reply,
          error: reason,
          status: "error",
        })
        store.setStatus("error")
        store.setError(reason)
      }

      if (report.applied.length > 0) {
        const integrity = checkTurnIntegrity(current, workspace, actions)
        if (!integrity.ok) {
          failTurn(
            `Change discarded to protect the workspace: ${integrity.reason}.`,
          )
          return
        }
        try {
          dispatch({ type: "set_workspace", payload: { workspace } } as never)
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
      store.updateTurn(turnId, {
        thinking: turnDebug.thinking,
        thinkingMs: turnDebug.thinkingMs,
        clamped: noThink,
        toolCalls: turnDebug.toolCalls,
        reply,
        outcome: turnOutcome,
        changes: describeChanges(report.workspace, report),
        repairs: turnDebug.repairs.length > 0 ? turnDebug.repairs : undefined,
        warnings: warnings.length > 0 ? warnings : undefined,
        rejected: report.rejected.length > 0 ? report.rejected : undefined,
        status: failed ? "error" : "done",
      })
      store.setStatus(failed ? "error" : "idle")
    } catch (caught) {
      if (isAbortError(caught)) {
        store.updateTurn(turnId, { status: "stopped" })
        store.setStatus("idle")
        return
      }
      const messageText =
        caught instanceof Error ? caught.message : "Agent request failed."
      store.updateTurn(turnId, { error: messageText, status: "error" })
      store.setStatus("error")
      store.setError(messageText)
    } finally {
      if (activeController === controller) activeController = null
    }
  }

  function stop(): void {
    activeController?.abort()
  }

  function warm(): Promise<void> {
    if (warmInFlight) return warmInFlight
    warmInFlight = (async () => {
      try {
        const config = await getAgentConfig()
        if (config) store.setConfig(config)
        await warmAgent({ model: store.model })
      } catch {
        // Warm-up is best-effort; a failure just means the first turn loads cold.
      } finally {
        warmInFlight = null
      }
    })()
    return warmInFlight
  }

  const modelOptions = computed(() =>
    (store.config?.models ?? []).map((value) => ({ label: value, value })),
  )

  const thinkingOptions = computed(() => {
    const model = store.model
    if (!model) return []
    const options = store.config?.thinkingByModel?.[model]?.options ?? []
    return options.map((option) => ({ label: option.label, value: option.value }))
  })

  return {
    send,
    stop,
    warm,
    reset: store.reset,
    modelOptions,
    thinkingOptions,
  }
}

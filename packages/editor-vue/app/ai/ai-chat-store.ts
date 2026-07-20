import type {
  ActionRepair,
  AgentToolCall,
  RejectedActionResult,
  ThinkingLevelOption,
} from "@seldon/ai"
import type { AgentConfig } from "@seldon/editor/lib/ai/run-agent-chat"
import { defineStore } from "pinia"
import { ref } from "vue"

export type HariStatus = "idle" | "pending" | "error"

/** Per-turn lifecycle, used to pick the transcript block for the last turn. */
export type TurnStatus = "pending" | "done" | "error" | "stopped"

/** Reducer-truth result of a turn, independent of the model's reply prose. */
export type TurnOutcome = "applied" | "ineffective" | "none"

/** One chat turn's structured record. Mirrors the React `HariTurn`. */
export interface HariTurn {
  id: string
  prompt: string
  status: TurnStatus
  thinking?: string
  thinkingMs?: number
  clamped?: boolean
  toolCalls?: AgentToolCall[]
  reply?: string
  outcome?: TurnOutcome
  changes?: string[]
  repairs?: ActionRepair[]
  warnings?: string[]
  rejected?: RejectedActionResult[]
  error?: string
}

let turnSequence = 0

/**
 * AI chat transcript and session config, mirroring the React `use-ai-chat`
 * zustand store: turns, streaming status, the agent session config, and the
 * selected model and thinking level for the next turn.
 */
export const useAiChatStore = defineStore("ai-chat", () => {
  const turns = ref<HariTurn[]>([])
  const status = ref<HariStatus>("idle")
  const error = ref<string | null>(null)
  const config = ref<AgentConfig | null>(null)
  const model = ref<string | undefined>(undefined)
  const thinkingLevel = ref<ThinkingLevelOption | undefined>(undefined)

  function startTurn(prompt: string): string {
    const id = `turn-${(turnSequence += 1)}`
    turns.value = [...turns.value, { id, prompt, status: "pending" }]
    status.value = "pending"
    error.value = null
    return id
  }

  function updateTurn(id: string, patch: Partial<HariTurn>): void {
    turns.value = turns.value.map((turn) =>
      turn.id === id ? { ...turn, ...patch } : turn,
    )
  }

  function mutateTurn(id: string, update: (turn: HariTurn) => HariTurn): void {
    turns.value = turns.value.map((turn) =>
      turn.id === id ? update(turn) : turn,
    )
  }

  function setStatus(next: HariStatus): void {
    status.value = next
  }

  function setError(next: string | null): void {
    error.value = next
  }

  function setConfig(next: AgentConfig): void {
    config.value = next
    if (model.value === undefined) model.value = next.defaults.model
    if (thinkingLevel.value === undefined) {
      thinkingLevel.value = next.defaults.thinkingLevel
    }
  }

  function setModel(next: string): void {
    model.value = next
  }

  function setThinkingLevel(next: ThinkingLevelOption): void {
    thinkingLevel.value = next
  }

  function reset(): void {
    turns.value = []
    status.value = "idle"
    error.value = null
  }

  return {
    turns,
    status,
    error,
    config,
    model,
    thinkingLevel,
    startTurn,
    updateTurn,
    mutateTurn,
    setStatus,
    setError,
    setConfig,
    setModel,
    setThinkingLevel,
    reset,
  }
})

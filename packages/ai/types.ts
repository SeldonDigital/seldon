import type {
  BoardKey,
  Workspace,
  WorkspaceAction,
} from "@seldon/core/workspace/types"
import type { ActionRepair } from "./repair/normalize-actions"

/** One turn of the chat conversation, passed back for context on later turns. */
export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

/** Input to {@link chatToActions}. The workspace is read for context only; it is never mutated here. */
export interface ChatToActionsInput {
  workspace: Workspace
  message: string
  history?: ChatMessage[]
  /** Board the user is looking at. Its node tree is summarized in the context. */
  activeBoardKey?: BoardKey
  /** Node the user has selected on the canvas, surfaced as the primary target. */
  selectedNodeId?: string
  /** Variant-root column of the selected node, for disambiguating shared ids. */
  selectedNodeRootId?: string
  /** Model id override. Defaults to `SELDON_AI_MODEL` env or `qwen3`. */
  model?: string
}

/** Context and model output captured for debugging. Logged by the editor console. */
export interface AgentDebug {
  /** The compact context sent to the model. */
  context: string
  /** The raw JSON string the model returned before parsing. */
  rawResponse: string
  /** Deterministic shape fixes applied to the actions before returning. */
  repairs: ActionRepair[]
  /** Present when a corrective round-trip ran because core rejected the first pass. */
  correction?: AgentCorrection
  /** Ollama timing, token, and memory metrics summed across the turn's calls. */
  metrics?: AgentMetrics
}

/** Performance summary for one chat turn, aggregated over its model calls. */
export interface AgentMetrics {
  /** Model id that served the turn. */
  model: string
  /** Number of `/api/chat` calls in the turn (2 when a corrective call ran). */
  calls: number
  /** Total wall time across calls, in milliseconds. */
  totalMs: number
  /** Model load time across calls, in milliseconds. */
  loadMs: number
  /** Input tokens processed across calls. */
  promptTokens: number
  /** Output tokens generated across calls. */
  outputTokens: number
  /** Output tokens per second over the generation phase, if measurable. */
  outputTokensPerSecond?: number
  /** Resident size of the loaded model in bytes, from `/api/ps`. */
  modelSizeBytes?: number
  /** VRAM footprint of the loaded model in bytes, from `/api/ps`. */
  modelVramBytes?: number
}

/** Details of the single corrective model call, for the console log. */
export interface AgentCorrection {
  /** The rejection reasons fed back to the model. */
  reasons: string[]
  /** The raw JSON string the corrective call returned. */
  rawResponse: string
}

/** Result of {@link chatToActions}. Actions are applied by the caller through the workspace reducer. */
export interface ChatToActionsResult {
  actions: WorkspaceAction[]
  reply: string
  debug: AgentDebug
}

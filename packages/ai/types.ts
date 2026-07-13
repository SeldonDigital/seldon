import type {
  BoardKey,
  Workspace,
  WorkspaceAction,
} from "@seldon/core/workspace/types"

import type { ThinkingLevelOption } from "./pi/model"
import type { ActionRepair } from "./repair/normalize-actions"

/** One turn of the chat conversation, passed back for context on later turns. */
export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

/**
 * The kind of thing the user has selected, which sets the harness's expected
 * reach for the turn. The editor classifies the selection and passes it in, so
 * the harness drives context, tool defaults, and the permission gate from an
 * explicit scope rather than inferring it from ids.
 */
export type SelectionScope =
  | "workspace"
  | "board"
  | "variant"
  | "instance"
  | "theme"
  | "fontCollection"
  | "iconSet"
  | "media"

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
  /** Board selected on the canvas when no node is selected, for sentinel disambiguation. */
  selectedBoardId?: BoardKey
  /**
   * The selection scope the editor classified for this turn. Drives the
   * per-turn context, the deterministic tool defaults, and the permission gate.
   */
  scope?: SelectionScope
  /**
   * The theme, font collection, or icon set entry id to edit when the scope is
   * a resource scope. Resolved by the editor from the selected resource entry,
   * resource item, or resource board default.
   */
  resourceTargetId?: string
  /** Model id override. Defaults to `SELDON_AI_MODEL` env or `gpt-oss:20b`. */
  model?: string
  /** Thinking level for the model. */
  thinkingLevel?: ThinkingLevelOption
  /**
   * Forces reasoning off for this turn, overriding the thinking level. Sends an
   * explicit `enable_thinking: false` to qwen while tool-calling stays enabled.
   * A test lever for clamping overthinking on direct edits.
   */
  noThink?: boolean
  /** Streams turn events as they happen, so the caller can render live. */
  onEvent?: (event: AgentStreamEvent) => void
  /**
   * Aborts the turn. When it fires, the Pi session is stopped so the local model
   * stops generating. Set server-side from the request's disconnect, so a user
   * pressing Stop in the editor cancels the running turn.
   */
  signal?: AbortSignal
}

/**
 * One incremental event streamed during a turn, before the final result. The
 * transport writes these as they arrive so the UI can animate the reply.
 */
export type AgentStreamEvent =
  | { type: "thinking"; delta: string }
  | { type: "thinkingDone"; ms: number }
  | { type: "text"; delta: string }
  | { type: "tool"; name: string }
  | { type: "toolResult"; ok: boolean }

/** One tool the model invoked during a turn, with its final status. */
export interface AgentToolCall {
  /** Tool name, such as `set_properties` or `find_nodes`. */
  name: string
  /** False when the tool reported an error. */
  ok: boolean
}

/** Context and model output captured for debugging. Logged by the editor console. */
export interface AgentDebug {
  /** The compact context sent to the model. */
  context: string
  /** The final assistant text the model returned. */
  rawResponse: string
  /** Deterministic shape fixes applied to the actions before returning. */
  repairs: ActionRepair[]
  /** Reasoning text the model streamed, when thinking is enabled. */
  thinking?: string
  /** Tool calls the model made during the turn, in order. */
  toolCalls?: AgentToolCall[]
  /** Wall time the model spent thinking, in milliseconds, when it thought. */
  thinkingMs?: number
  /** Timing and token metrics for the turn. */
  metrics?: AgentMetrics
}

/** Performance summary for one chat turn, aggregated over its model calls. */
export interface AgentMetrics {
  /** Model id that served the turn. */
  model: string
  /** Number of model calls the turn made. */
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
  /** Resident size of the loaded model in bytes, when reported. */
  modelSizeBytes?: number
  /** VRAM footprint of the loaded model in bytes, when reported. */
  modelVramBytes?: number
}

/** Result of {@link chatToActions}. Actions are applied by the caller through the workspace reducer. */
export interface ChatToActionsResult {
  actions: WorkspaceAction[]
  reply: string
  debug: AgentDebug
}

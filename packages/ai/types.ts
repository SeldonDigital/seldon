import type { ThinkingLevelOption } from "./pi/model"
import type { ActionRepair } from "./repair/normalize-actions"
import type { BoardKey, Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

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

/**
 * The editor's Isolation Mode, forwarded when it is on. It hard-scopes the turn
 * to the isolated board and the components its selected variant uses. `boardKey`
 * is the workspace board map key; `variantRootId` is the frozen variant root, or
 * null when the whole board is isolated.
 */
export interface IsolationScope {
  boardKey: BoardKey
  variantRootId: string | null
}

/**
 * Input to {@link chatToActions}. `workspace` is read for context only and is
 * never mutated here. `activeBoardKey` is the board on screen, summarized in the
 * context. `selectedNodeId` is the primary target on the canvas, with
 * `selectedNodeRootId` giving its variant-root column to disambiguate shared ids
 * and `selectedBoardId` standing in when no node is selected. `scope` is the
 * selection scope the editor classified, which drives per-turn context, tool
 * defaults, and the permission gate. `isolation` pins the active board and
 * variant when Isolation Mode is on and rejects edits outside its closure at
 * commit time. `resourceTargetId` is the theme, font collection, or icon set
 * entry to edit under a resource scope. `model` overrides the model id,
 * defaulting to `SELDON_AI_MODEL` or `gpt-oss:20b`. `thinkingLevel`,
 * `thinkingCapable`, and `noThink` control the reasoning pass: the requested
 * level, whether the model can think at all, and a hard override forcing
 * reasoning off for the turn. `onEvent` streams turn events for live rendering,
 * and `signal` aborts the turn so the local model stops generating.
 */
export interface ChatToActionsInput {
  workspace: Workspace
  message: string
  history?: ChatMessage[]
  activeBoardKey?: BoardKey
  selectedNodeId?: string
  selectedNodeRootId?: string
  selectedBoardId?: BoardKey
  scope?: SelectionScope
  isolation?: IsolationScope
  resourceTargetId?: string
  model?: string
  thinkingLevel?: ThinkingLevelOption
  thinkingCapable?: boolean
  noThink?: boolean
  onEvent?: (event: AgentStreamEvent) => void
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

/**
 * One tool the model invoked during a turn, with its final status. `name` is the
 * tool name, such as `set_properties` or `find_nodes`. `ok` is false when the
 * tool reported an error.
 */
export interface AgentToolCall {
  name: string
  ok: boolean
}

/**
 * Context and model output captured for debugging, logged by the editor console.
 * `context` is the compact context sent to the model and `rawResponse` the final
 * assistant text. `repairs` are the deterministic shape fixes applied before
 * returning. `thinking` is the reasoning text streamed when thinking is enabled,
 * `toolCalls` the tools invoked in order, `thinkingMs` the wall time spent
 * thinking, and `metrics` the turn's timing and token totals.
 */
export interface AgentDebug {
  context: string
  rawResponse: string
  repairs: ActionRepair[]
  thinking?: string
  toolCalls?: AgentToolCall[]
  thinkingMs?: number
  metrics?: AgentMetrics
}

/**
 * Performance summary for one chat turn, aggregated over its model calls.
 * `model` is the id that served the turn and `calls` the number of model calls.
 * `totalMs` and `loadMs` are the total wall time and model load time across
 * calls. `promptTokens` and `outputTokens` are the tokens processed and
 * generated. `firstTokenMs` is the wall time from the prompt call to the first
 * streamed event, covering model load and prompt prefill.
 * `outputTokensPerSecond` is the generation-phase throughput when measurable.
 * `modelSizeBytes` and `modelVramBytes` are the loaded model's resident size and
 * VRAM footprint when reported.
 */
export interface AgentMetrics {
  model: string
  calls: number
  totalMs: number
  loadMs: number
  promptTokens: number
  outputTokens: number
  firstTokenMs?: number
  outputTokensPerSecond?: number
  modelSizeBytes?: number
  modelVramBytes?: number
}

/** One action the reducer rejected during the turn, with the reducer's reason. */
export interface RejectedActionResult {
  type: string
  reason: string
}

/**
 * Result of {@link chatToActions}. The caller adopts {@link workspace} directly
 * with one `set_workspace` dispatch rather than re-applying {@link actions}, so
 * ids the turn minted stay stable. `workspace` is the workspace the turn built,
 * already folded through the reducer. `actions` is retained for the change
 * summary and undo grouping. `reply` is the assistant text. `ineffective` lists
 * action types that validated but changed nothing, in call order, and `rejected`
 * the actions the reducer rejected with its reason. `debug` carries the
 * debugging capture.
 */
export interface ChatToActionsResult {
  actions: WorkspaceAction[]
  workspace: Workspace
  reply: string
  ineffective: string[]
  rejected: RejectedActionResult[]
  debug: AgentDebug
}

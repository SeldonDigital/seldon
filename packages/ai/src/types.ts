import type {
  BoardKey,
  Workspace,
  WorkspaceAction,
} from "@seldon/core/workspace/types"

/** One turn of the chat conversation, passed back for context on later turns. */
export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

/** Input to {@link chatToActions}. The workspace is read for grounding only; it is never mutated here. */
export interface ChatToActionsInput {
  workspace: Workspace
  message: string
  history?: ChatMessage[]
  /** Board the user is looking at. Its node tree is summarized for grounding. */
  activeBoardKey?: BoardKey
  /** Node the user has selected on the canvas, surfaced as the primary target. */
  selectedNodeId?: string
  /** Variant-root column of the selected node, for disambiguating shared ids. */
  selectedNodeRootId?: string
  /** Model id override. Defaults to `SELDON_AI_MODEL` env or `qwen3`. */
  model?: string
}

/** Grounding and model output captured for debugging. Logged by the editor console. */
export interface AgentDebug {
  /** The compact grounding summary sent to the model. */
  context: string
  /** The raw JSON string the model returned before parsing. */
  rawResponse: string
}

/** Result of {@link chatToActions}. Actions are applied by the caller through the workspace reducer. */
export interface ChatToActionsResult {
  actions: WorkspaceAction[]
  reply: string
  debug: AgentDebug
}

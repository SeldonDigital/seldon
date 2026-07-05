import {
  chatToActions,
  warmModel,
  type AgentDebug,
  type AgentMetrics,
  type ChatMessage,
} from "@seldon/ai"
import type {
  BoardKey,
  Workspace,
  WorkspaceAction,
} from "@seldon/core/workspace/types"

export type AgentRequestBody = {
  workspace: Workspace
  message: string
  history?: ChatMessage[]
  activeBoardKey?: BoardKey
  selectedNodeId?: string
  selectedNodeRootId?: string
  model?: string
}

export type AgentResult = {
  actions: WorkspaceAction[]
  reply: string
  debug: AgentDebug
}

/**
 * Runs the local AI agent against a workspace and returns the actions it wants
 * to apply. The workspace is read for grounding only. The editor applies the
 * returned actions through the reducer, so this handler never mutates state.
 * Calls a local Ollama model, so it must run in a Node context.
 */
export async function runAgent(body: AgentRequestBody): Promise<AgentResult> {
  if (!body?.workspace) {
    throw new Error("Missing workspace in request body.")
  }
  if (typeof body.message !== "string" || body.message.trim() === "") {
    throw new Error("Missing message in request body.")
  }

  const { actions, reply, debug } = await chatToActions({
    workspace: body.workspace,
    message: body.message,
    history: body.history,
    activeBoardKey: body.activeBoardKey,
    selectedNodeId: body.selectedNodeId,
    selectedNodeRootId: body.selectedNodeRootId,
    model: body.model,
  })

  return { actions, reply, debug }
}

export type WarmResult = {
  ok: true
  metrics: AgentMetrics
}

/**
 * Loads the local model and prefills the stable system prompt without running a
 * turn, so the first real request skips the cold load and reuses the cached
 * system-prompt prefix. Called when the AI chat panel opens.
 */
export async function warmAgent(body?: { model?: string }): Promise<WarmResult> {
  const metrics = await warmModel({ model: body?.model })
  return { ok: true, metrics }
}

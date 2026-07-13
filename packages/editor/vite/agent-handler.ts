import {
  type AgentDebug,
  type AgentMetrics,
  type AgentStreamEvent,
  type ChatMessage,
  THINKING_LEVEL_OPTIONS,
  type ThinkingLevelOption,
  chatToActions,
  resolvePiModelId,
  warmModel,
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
  selectedBoardId?: BoardKey
  model?: string
  thinkingLevel?: ThinkingLevelOption
  noThink?: boolean
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
 * Runs the Pi tool-calling loop against a local model, so it must run in a Node
 * context.
 */
export async function runAgent(
  body: AgentRequestBody,
  onEvent?: (event: AgentStreamEvent) => void,
): Promise<AgentResult> {
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
    selectedBoardId: body.selectedBoardId,
    model: body.model,
    thinkingLevel: body.thinkingLevel,
    noThink: body.noThink,
    onEvent,
  })

  return { actions, reply, debug }
}

/** Session-config choices the Hari palette renders. */
export type AgentConfig = {
  models: string[]
  thinkingLevels: ThinkingLevelOption[]
  defaults: {
    model: string
    thinkingLevel: ThinkingLevelOption
  }
}

/** Lists the local Ollama models, best-effort. Empty when Ollama is unreachable. */
async function listOllamaModels(): Promise<string[]> {
  const host = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434"
  try {
    const response = await fetch(`${host}/api/tags`)
    if (!response.ok) return []
    const data = (await response.json()) as {
      models?: { name?: string; model?: string }[]
    }
    const names = (data.models ?? [])
      .map((entry) => entry.model ?? entry.name)
      .filter((name): name is string => typeof name === "string")
    return [...new Set(names)].sort()
  } catch {
    return []
  }
}

/**
 * Returns the session-config choices for the Hari palette: the locally available
 * models, the thinking levels, and the current defaults. The model list is
 * best-effort and comes from the local Ollama server.
 */
export async function agentConfig(): Promise<AgentConfig> {
  const defaultModel = resolvePiModelId()
  const models = await listOllamaModels()
  return {
    models: models.includes(defaultModel) ? models : [defaultModel, ...models],
    thinkingLevels: THINKING_LEVEL_OPTIONS,
    defaults: {
      model: defaultModel,
      thinkingLevel: "minimal",
    },
  }
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
export async function warmAgent(body?: {
  model?: string
}): Promise<WarmResult> {
  const metrics = await warmModel({ model: body?.model })
  return { ok: true, metrics }
}

import {
  type AgentDebug,
  type AgentMetrics,
  type AgentStreamEvent,
  type ChatMessage,
  type SelectionScope,
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
  scope?: SelectionScope
  resourceTargetId?: string
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
  signal?: AbortSignal,
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
    scope: body.scope,
    resourceTargetId: body.resourceTargetId,
    model: await resolveAvailableModel(body.model),
    thinkingLevel: body.thinkingLevel,
    noThink: body.noThink,
    onEvent,
    signal,
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
  warnings?: string[]
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

function missingModelMessage(model: string, models: string[]): string {
  if (models.length === 0) {
    return `AI model "${model}" is not installed in Ollama. No local Ollama models are installed. Pull it with: ollama pull ${model}`
  }
  return `AI model "${model}" is not installed in Ollama. Available models: ${models.join(", ")}. Pull it with: ollama pull ${model}`
}

async function resolveAvailableModel(requestedModel: string | undefined) {
  const configuredDefaultModel = resolvePiModelId()
  const models = await listOllamaModels()
  if (models.length === 0) return requestedModel ?? configuredDefaultModel
  if (requestedModel) {
    if (!models.includes(requestedModel)) {
      throw new Error(missingModelMessage(requestedModel, models))
    }
    return requestedModel
  }
  return models.includes(configuredDefaultModel)
    ? configuredDefaultModel
    : models[0]
}

/**
 * Returns the session-config choices for the Hari palette: the locally available
 * models, the thinking levels, and the current defaults. The model list is
 * best-effort and comes from the local Ollama server.
 */
export async function agentConfig(): Promise<AgentConfig> {
  const configuredDefaultModel = resolvePiModelId()
  const models = await listOllamaModels()
  const availableModels = models.length > 0 ? models : [configuredDefaultModel]
  const defaultModel = availableModels.includes(configuredDefaultModel)
    ? configuredDefaultModel
    : availableModels[0]
  const warnings =
    models.length > 0 && !models.includes(configuredDefaultModel)
      ? [missingModelMessage(configuredDefaultModel, models)]
      : undefined
  return {
    models: availableModels,
    thinkingLevels: THINKING_LEVEL_OPTIONS,
    defaults: {
      model: defaultModel,
      thinkingLevel: "minimal",
    },
    warnings,
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
  const metrics = await warmModel({
    model: await resolveAvailableModel(body?.model),
  })
  return { ok: true, metrics }
}

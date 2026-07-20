import {
  type AgentDebug,
  type AgentMetrics,
  type AgentStreamEvent,
  type ChatMessage,
  type ModelThinking,
  type RejectedActionResult,
  type SelectionScope,
  type ThinkingLevelOption,
  chatToActions,
  clampedThinkingLevel,
  deriveModelThinking,
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
  thinkingCapable?: boolean
  noThink?: boolean
}

export type AgentResult = {
  actions: WorkspaceAction[]
  /** Workspace the turn built, adopted directly by the editor as one undo step. */
  workspace: Workspace
  reply: string
  ineffective: string[]
  rejected: RejectedActionResult[]
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

  const { actions, workspace, reply, ineffective, rejected, debug } =
    await chatToActions({
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
      thinkingCapable: body.thinkingCapable,
      noThink: body.noThink,
      onEvent,
      signal,
    })

  return { actions, workspace, reply, ineffective, rejected, debug }
}

/** Session-config choices the Hari palette renders. */
export type AgentConfig = {
  models: string[]
  /** Thinking menu per model, resolved from each model's Ollama capabilities. */
  thinkingByModel: Record<string, ModelThinking>
  /** The level Clamp resolves to per model: `off` where reasoning can be turned off, else the lowest effort. */
  clampedLevels: Record<string, ThinkingLevelOption>
  defaults: {
    model: string
    thinkingLevel: ThinkingLevelOption
  }
  /** Set when the configured default model is not installed in Ollama. */
  warnings?: string[]
}

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434"

/** Lists the local Ollama models, best-effort. Empty when Ollama is unreachable. */
async function listOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/tags`)
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
 * The capabilities Ollama reports for a model through `/api/show`, such as
 * `thinking` for a reasoning model. Best-effort: returns undefined when the
 * server is unreachable or omits the field, so the caller falls back to the
 * name-based thinking check.
 */
async function showModelCapabilities(
  model: string,
): Promise<string[] | undefined> {
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/show`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model }),
    })
    if (!response.ok) return undefined
    const data = (await response.json()) as { capabilities?: string[] }
    return Array.isArray(data.capabilities) ? data.capabilities : undefined
  } catch {
    return undefined
  }
}

/** Message shown when a model is not installed in the local Ollama server. */
function missingModelMessage(model: string, installed: string[]): string {
  if (installed.length === 0) {
    return `AI model "${model}" is not installed in Ollama. No local Ollama models are installed. Pull it with: ollama pull ${model}`
  }
  return `AI model "${model}" is not installed in Ollama. Available models: ${installed.join(", ")}. Pull it with: ollama pull ${model}`
}

/**
 * Resolves the model a request should actually use. An explicitly requested
 * model must be installed, or the request is rejected with a clear message
 * instead of silently running (and likely failing) against a missing model.
 * With no request, falls back to the configured default when installed, else
 * the first discovered model. When Ollama reports no models at all, the
 * request proceeds best-effort so the underlying Ollama error surfaces.
 */
async function resolveAvailableModel(
  requestedModel: string | undefined,
): Promise<string> {
  const configuredDefaultModel = resolvePiModelId()
  const discovered = await listOllamaModels()
  if (discovered.length === 0) return requestedModel ?? configuredDefaultModel
  if (requestedModel) {
    if (!discovered.includes(requestedModel)) {
      throw new Error(missingModelMessage(requestedModel, discovered))
    }
    return requestedModel
  }
  return discovered.includes(configuredDefaultModel)
    ? configuredDefaultModel
    : discovered[0]
}

/**
 * Returns the session-config choices for the Hari palette: the locally available
 * models, the thinking menu resolved per model from Ollama's reported
 * capabilities, and the current defaults. The model list and capabilities are
 * best-effort and come from the local Ollama server.
 */
export async function agentConfig(): Promise<AgentConfig> {
  const configuredDefaultModel = resolvePiModelId()
  const discovered = await listOllamaModels()
  const models = discovered.length > 0 ? discovered : [configuredDefaultModel]
  const defaultModel = models.includes(configuredDefaultModel)
    ? configuredDefaultModel
    : models[0]
  const warnings =
    discovered.length > 0 && !discovered.includes(configuredDefaultModel)
      ? [missingModelMessage(configuredDefaultModel, discovered)]
      : undefined
  const thinkingByModel: Record<string, ModelThinking> = {}
  const clampedLevels: Record<string, ThinkingLevelOption> = {}
  await Promise.all(
    models.map(async (model) => {
      const capabilities = await showModelCapabilities(model)
      thinkingByModel[model] = deriveModelThinking(model, capabilities)
      clampedLevels[model] = clampedThinkingLevel(model)
    }),
  )
  return {
    models,
    thinkingByModel,
    clampedLevels,
    defaults: {
      model: defaultModel,
      thinkingLevel: thinkingByModel[defaultModel]?.default ?? "off",
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

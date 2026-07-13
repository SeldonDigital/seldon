import type {
  Model,
  OpenAICompletionsCompat,
  ThinkingLevel,
  ThinkingLevelMap,
} from "@earendil-works/pi-ai"
import { AuthStorage, ModelRegistry } from "@earendil-works/pi-coding-agent"

const DEFAULT_HOST = "http://127.0.0.1:11434"
const DEFAULT_MODEL = "gpt-oss:20b"

/**
 * Provider name for the local Ollama model. Pi resolves an API key by provider,
 * and Ollama's OpenAI-compatible endpoint accepts any token, so a runtime dummy
 * key keyed to this name satisfies Pi's preflight without persisting anything.
 */
const OLLAMA_PROVIDER = "ollama"

/**
 * Thinking level the caller may request. Pi's own `ThinkingLevel` omits `off`;
 * we add it for the internal Clamp path, which turns reasoning off entirely on
 * models that support it. The menu does not offer `off`; Clamp is that control.
 */
export type ThinkingLevelOption = "off" | ThinkingLevel

/** The thinking levels the config endpoint offers, ordered least to most. */
export const THINKING_LEVEL_OPTIONS: ThinkingLevelOption[] = [
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
]

/** Resolves the model id from an explicit value, env, or the local default. */
export function resolvePiModelId(model?: string): string {
  return model ?? process.env.SELDON_AI_MODEL ?? DEFAULT_MODEL
}

function resolveHost(host?: string): string {
  return host ?? process.env.OLLAMA_HOST ?? DEFAULT_HOST
}

/**
 * True when the model can run a thinking pass, so the thinking level has an
 * effect. Among the local models we ship this covers the qwen3 family and
 * gpt-oss. Coder and llama models have no thinking mode, so their thinking level
 * is a no-op and reasoning stays off.
 */
export function supportsThinking(model?: string): boolean {
  const id = resolvePiModelId(model).toLowerCase()
  return id.includes("qwen3") || id.includes("gpt-oss")
}

/**
 * The thinking level Clamp requests for a model. qwen3 reads the chat-template
 * `enable_thinking` kwarg, so it turns reasoning fully off. gpt-oss always
 * reasons over Ollama's endpoint and only accepts an effort, so Clamp maps it to
 * the lowest effort instead. Other models have no thinking pass, so `off` is a
 * no-op that matches their default.
 */
export function clampedThinkingLevel(model?: string): ThinkingLevelOption {
  const id = resolvePiModelId(model).toLowerCase()
  return id.includes("gpt-oss") ? "low" : "off"
}

/**
 * OpenAI-compatible overrides for a local Ollama model. Ollama does not
 * understand the `developer` role, so the system prompt goes through as a
 * `system` message. Thinking-capable models use a per-family thinking control:
 * qwen3 reads `chat_template_kwargs.enable_thinking`, and gpt-oss takes an
 * OpenAI-style `reasoning_effort` that Ollama accepts for it.
 */
function ollamaCompat(id: string): OpenAICompletionsCompat {
  const compat: OpenAICompletionsCompat = { supportsDeveloperRole: false }
  const lower = id.toLowerCase()
  if (lower.includes("qwen3")) {
    compat.thinkingFormat = "qwen-chat-template"
    compat.supportsReasoningEffort = false
  } else if (lower.includes("gpt-oss")) {
    compat.supportsReasoningEffort = true
  }
  return compat
}

/**
 * Maps pi thinking levels to the efforts a model accepts. gpt-oss over Ollama
 * only takes `low`, `medium`, `high`, `max`, or `none`, so the levels it does
 * not know fold to the nearest valid effort. `low`, `medium`, and `high` pass
 * through unmapped. Models without an entry send their level unchanged.
 */
function thinkingLevelMap(id: string): ThinkingLevelMap | undefined {
  if (!id.toLowerCase().includes("gpt-oss")) return undefined
  return { minimal: "low", xhigh: "high", max: "high" }
}

/**
 * Builds a Pi `Model` that targets a local Ollama server through its
 * OpenAI-compatible endpoint. Ollama needs no key and reports no cost, so the
 * cost fields are zero and auth is a runtime dummy (see {@link createPiAuth}).
 * `reasoning` is on only when the caller wants a thinking pass this turn, which
 * the session gates on both the requested level and {@link supportsThinking}.
 * The `compat` block carries the per-family thinking control for Ollama.
 */
export function buildOllamaModel(options: {
  model?: string
  host?: string
  reasoning?: boolean
}): Model<"openai-completions"> {
  const id = resolvePiModelId(options.model)
  const host = resolveHost(options.host)
  return {
    id,
    name: `${id} (Ollama)`,
    api: "openai-completions",
    provider: OLLAMA_PROVIDER,
    baseUrl: `${host}/v1`,
    reasoning: options.reasoning ?? false,
    thinkingLevelMap: thinkingLevelMap(id),
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 32768,
    maxTokens: 4096,
    compat: ollamaCompat(id),
  }
}

/**
 * Creates Pi auth wired for local Ollama. The runtime key is not persisted and
 * only satisfies Pi's model preflight; nothing leaves the machine.
 */
export function createPiAuth(): {
  authStorage: AuthStorage
  modelRegistry: ModelRegistry
} {
  const authStorage = AuthStorage.create()
  authStorage.setRuntimeApiKey(OLLAMA_PROVIDER, "ollama")
  const modelRegistry = ModelRegistry.create(authStorage)
  return { authStorage, modelRegistry }
}

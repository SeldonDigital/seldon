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
 * we add it for turning reasoning off, which the binary menu offers as "Off" and
 * Clamp forces on a binary model.
 */
export type ThinkingLevelOption = "off" | ThinkingLevel

/** Resolves the model id from an explicit value, env, or the local default. */
export function resolvePiModelId(model?: string): string {
  return model ?? process.env.SELDON_AI_MODEL ?? DEFAULT_MODEL
}

function resolveHost(host?: string): string {
  return host ?? process.env.OLLAMA_HOST ?? DEFAULT_HOST
}

/**
 * Name-based fallback for whether a model can run a thinking pass. Used only
 * when Ollama does not report `capabilities` for the model (older Ollama, or an
 * imported GGUF with an incomplete Modelfile). The primary signal is the
 * `thinking` capability from `/api/show`, resolved by {@link deriveModelThinking}.
 */
export function supportsThinking(model?: string): boolean {
  const id = resolvePiModelId(model).toLowerCase()
  return id.includes("qwen3") || id.includes("gpt-oss")
}

/**
 * True when the model takes a graded reasoning effort over Ollama's OpenAI
 * endpoint, rather than a binary on/off. This is the one thinking trait Ollama
 * does not report through `capabilities`, so it stays a name check. gpt-oss is
 * the graded family we ship; every other thinking model is treated as binary.
 */
export function supportsReasoningEffort(model?: string): boolean {
  return resolvePiModelId(model).toLowerCase().includes("gpt-oss")
}

/**
 * The thinking level Clamp requests for a model. A graded model cannot turn
 * reasoning off, so Clamp drops it to the lowest effort. Every other model turns
 * off, which is a real disable for a binary model and a no-op for a
 * non-thinking one.
 */
export function clampedThinkingLevel(model?: string): ThinkingLevelOption {
  return supportsReasoningEffort(model) ? "low" : "off"
}

/** One entry in a model's thinking menu: the value sent to the turn and its label. */
export interface ThinkingMenuOption {
  value: ThinkingLevelOption
  label: string
}

/**
 * A model's thinking menu, resolved from its capabilities:
 *
 * - `graded`: a reasoning-effort model, so the menu offers low, medium, high.
 * - `binary`: an on/off thinking model, so the menu offers Off and On.
 * - `none`: no thinking pass, so the menu is empty and the level stays off.
 */
export interface ModelThinking {
  mode: "graded" | "binary" | "none"
  options: ThinkingMenuOption[]
  default: ThinkingLevelOption
}

const GRADED_OPTIONS: ThinkingMenuOption[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

// A binary model only distinguishes thinking on from off. "On" carries a valid
// level so the turn enables reasoning; a binary model ignores the grade.
const BINARY_OPTIONS: ThinkingMenuOption[] = [
  { value: "off", label: "Off" },
  { value: "medium", label: "On" },
]

/**
 * Resolves a model's thinking menu. `capabilities` is the `capabilities` array
 * from Ollama's `/api/show`, which lists `thinking` for a reasoning model.
 * When it is missing, falls back to the {@link supportsThinking} name check so
 * an older Ollama or an imported GGUF still behaves. The graded-versus-binary
 * split comes from {@link supportsReasoningEffort}.
 */
export function deriveModelThinking(
  model: string,
  capabilities?: string[],
): ModelThinking {
  const thinks = capabilities
    ? capabilities.includes("thinking")
    : supportsThinking(model)
  if (!thinks) return { mode: "none", options: [], default: "off" }
  if (supportsReasoningEffort(model)) {
    return { mode: "graded", options: GRADED_OPTIONS, default: "medium" }
  }
  return { mode: "binary", options: BINARY_OPTIONS, default: "medium" }
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
  } else if (supportsReasoningEffort(id)) {
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

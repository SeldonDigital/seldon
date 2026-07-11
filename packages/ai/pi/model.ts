import type { Model, ThinkingLevel } from "@earendil-works/pi-ai"
import { AuthStorage, ModelRegistry } from "@earendil-works/pi-coding-agent"

const DEFAULT_HOST = "http://127.0.0.1:11434"
const DEFAULT_MODEL = "qwen3:4b"

/**
 * Provider name for the local Ollama model. Pi resolves an API key by provider,
 * and Ollama's OpenAI-compatible endpoint accepts any token, so a runtime dummy
 * key keyed to this name satisfies Pi's preflight without persisting anything.
 */
const OLLAMA_PROVIDER = "ollama"

/**
 * Thinking level the caller may request. Pi's own `ThinkingLevel` omits `off`;
 * we add it so the editor control can turn reasoning off entirely, which is the
 * fast default for schema-shaped edits.
 */
export type ThinkingLevelOption = "off" | ThinkingLevel

/** The thinking levels the config endpoint offers, ordered off to most. */
export const THINKING_LEVEL_OPTIONS: ThinkingLevelOption[] = [
  "off",
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
 * Builds a Pi `Model` that targets a local Ollama server through its
 * OpenAI-compatible endpoint. Ollama needs no key and reports no cost, so the
 * cost fields are zero and auth is a runtime dummy (see {@link createPiAuth}).
 * `reasoning` is on only when a thinking level above `off` is requested, since
 * qwen3 supports a thinking pass that the constrained edit path does not need.
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
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 32768,
    maxTokens: 4096,
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

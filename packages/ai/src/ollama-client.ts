const DEFAULT_HOST = "http://127.0.0.1:11434"
const DEFAULT_MODEL = "qwen3:4b"

export interface OllamaChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface OllamaChatOptions {
  model?: string
  messages: OllamaChatMessage[]
  /** JSON Schema that constrains the decode. Passed straight to Ollama `format`. */
  format?: unknown
  /** Overrides the Ollama base URL. Defaults to `OLLAMA_HOST` env or localhost. */
  host?: string
  /**
   * Whether the model may emit a reasoning pass. Defaults to `false`: on hybrid
   * reasoning models such as qwen3 the thinking pass adds a large hidden decode
   * that the constrained JSON output does not need. A future planning step can
   * opt back in per call.
   */
  think?: boolean
  /**
   * How long Ollama keeps the model resident after the call. Defaults to
   * `SELDON_AI_KEEP_ALIVE` or "30m". Keeping the model warm avoids the per-call
   * reload and lets llama.cpp reuse the KV prefix across turns.
   */
  keepAlive?: string
}

/** Timing and token counts Ollama reports for one `/api/chat` call. Durations are nanoseconds. */
export interface OllamaChatMetrics {
  model: string
  totalDuration?: number
  loadDuration?: number
  promptEvalCount?: number
  promptEvalDuration?: number
  evalCount?: number
  evalDuration?: number
}

/** One `/api/chat` result: the assistant content plus the call's metrics. */
export interface OllamaChatResult {
  content: string
  metrics: OllamaChatMetrics
}

/** Memory footprint of a loaded model, read from `/api/ps`. Bytes. */
export interface OllamaModelInfo {
  model: string
  size?: number
  sizeVram?: number
}

/** Resolves the model id from an explicit value, env, or the local default. */
export function resolveModel(model?: string): string {
  return model ?? process.env.SELDON_AI_MODEL ?? DEFAULT_MODEL
}

function resolveHost(host?: string): string {
  return host ?? process.env.OLLAMA_HOST ?? DEFAULT_HOST
}

/**
 * Calls a local Ollama `/api/chat` and returns the assistant message content
 * along with the call's timing and token metrics. Runs with `stream: false` and
 * `temperature: 0` for deterministic, single-shot responses. Inference stays on
 * the machine; nothing leaves the local host.
 */
export async function ollamaChat({
  model,
  messages,
  format,
  host,
  think,
  keepAlive,
}: OllamaChatOptions): Promise<OllamaChatResult> {
  const baseUrl = resolveHost(host)
  const resolvedModel = resolveModel(model)

  let response: Response
  try {
    response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: resolvedModel,
        messages,
        stream: false,
        format,
        think: think ?? false,
        keep_alive: keepAlive ?? process.env.SELDON_AI_KEEP_ALIVE ?? "30m",
        options: { temperature: 0 },
      }),
    })
  } catch {
    throw new Error(
      `Could not reach Ollama at ${baseUrl}. Is it running? Start it with "ollama serve" and pull a model, for example "ollama pull qwen3:4b".`,
    )
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "")
    throw new Error(
      `Ollama request failed (${response.status}). Is Ollama running on ${baseUrl}? ${detail}`,
    )
  }

  const data = (await response.json()) as {
    message?: { content?: string }
    model?: string
    total_duration?: number
    load_duration?: number
    prompt_eval_count?: number
    prompt_eval_duration?: number
    eval_count?: number
    eval_duration?: number
  }
  const content = data.message?.content
  if (typeof content !== "string") {
    throw new Error("Ollama response did not include message content.")
  }

  return {
    content,
    metrics: {
      model: data.model ?? resolvedModel,
      totalDuration: data.total_duration,
      loadDuration: data.load_duration,
      promptEvalCount: data.prompt_eval_count,
      promptEvalDuration: data.prompt_eval_duration,
      evalCount: data.eval_count,
      evalDuration: data.eval_duration,
    },
  }
}

/**
 * Reads `/api/ps` to report the memory footprint of a loaded model. Best-effort:
 * returns `undefined` when Ollama is unreachable, reports no running models, or
 * the requested model is not currently loaded. The chat API does not expose
 * memory, so this is the only way to surface capacity.
 */
export async function getLoadedModelInfo(
  model?: string,
  host?: string,
): Promise<OllamaModelInfo | undefined> {
  const baseUrl = resolveHost(host)
  const resolvedModel = resolveModel(model)

  try {
    const response = await fetch(`${baseUrl}/api/ps`)
    if (!response.ok) return undefined
    const data = (await response.json()) as {
      models?: { name?: string; model?: string; size?: number; size_vram?: number }[]
    }
    const models = data.models ?? []
    const match =
      models.find(
        (entry) => entry.model === resolvedModel || entry.name === resolvedModel,
      ) ?? models[0]
    if (!match) return undefined
    return {
      model: match.model ?? match.name ?? resolvedModel,
      size: match.size,
      sizeVram: match.size_vram,
    }
  } catch {
    return undefined
  }
}

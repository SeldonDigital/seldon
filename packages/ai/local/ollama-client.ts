import { resolveModelId } from "../shared/model-thinking"
import type { ThinkingLevelOption } from "../shared/model-thinking"

const DEFAULT_HOST = "http://127.0.0.1:11434"

function resolveHost(requestedHost?: string): string {
  return requestedHost ?? process.env.OLLAMA_HOST ?? DEFAULT_HOST
}

/** Thrown when an Ollama call fails to reach the server, errors, or returns unparsable content. */
export class OllamaCallError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message)
    this.name = "OllamaCallError"
  }
}

/** Per-call timing and token counts, read directly from Ollama's own response fields. */
export interface OllamaCallMetrics {
  promptTokens: number
  outputTokens: number
  evalDurationMs: number
  loadDurationMs: number
  totalDurationMs: number
}

export interface OllamaFormatCallOptions {
  model?: string
  host?: string
  /** The single-purpose instruction for this narrow call. */
  prompt: string
  /**
   * A flat JSON schema (an enum field, or a shallow 2-3 branch tagged union) --
   * this is the only shape empirically validated for reliable compliance across
   * qwen3 0.6b-8b. Deeper or recursive schemas were not tested and should not
   * be assumed to work as reliably.
   */
  schema: Record<string, unknown>
  /**
   * Every narrow resolver call in this harness runs with thinking off by
   * default: these are single-purpose picks, not open-ended reasoning, so a
   * thinking pass is pure latency cost with no expected accuracy benefit (see
   * plan). Pass a graded level only for a call that's deliberately been found
   * to need it.
   */
  think?: ThinkingLevelOption
}

export interface OllamaFormatCallResult<T> {
  value: T
  metrics: OllamaCallMetrics
}

interface OllamaChatResponse {
  message?: { content?: string }
  prompt_eval_count?: number
  eval_count?: number
  eval_duration?: number
  load_duration?: number
  total_duration?: number
}

const NANOS_PER_MS = 1e6

/**
 * Makes one Ollama chat call constrained to `schema` via the `format` field --
 * grammar-constrained decoding, not native tool-calling. The model cannot
 * emit output outside the schema's shape; it can still make a wrong but
 * validly-shaped choice, which is what callers must handle via the uniform
 * disambiguation contract, not something this primitive can fix.
 */
export async function callOllamaFormat<T>(
  options: OllamaFormatCallOptions,
): Promise<OllamaFormatCallResult<T>> {
  const resolvedHost = resolveHost(options.host)
  const resolvedModelId = resolveModelId(options.model)

  const thinkingLevel = options.think ?? "off"
  const thinkingIsDisabled = thinkingLevel === "off"

  let chatResponse: Response
  try {
    chatResponse = await fetch(`${resolvedHost}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: resolvedModelId,
        messages: [{ role: "user", content: options.prompt }],
        format: options.schema,
        stream: false,
        think: thinkingIsDisabled ? false : thinkingLevel,
        options: { temperature: 0 },
      }),
    })
  } catch (networkFailure) {
    throw new OllamaCallError(
      `Failed to reach Ollama at ${resolvedHost}`,
      networkFailure,
    )
  }

  const requestFailed = !chatResponse.ok
  if (requestFailed) {
    const errorBody = await chatResponse.text().catch(() => "")
    throw new OllamaCallError(
      `Ollama returned ${chatResponse.status}: ${errorBody}`,
    )
  }

  const responseBody = (await chatResponse.json()) as OllamaChatResponse
  const rawJsonContent = responseBody.message?.content ?? ""

  let parsedValue: T
  try {
    parsedValue = JSON.parse(rawJsonContent) as T
  } catch (parseFailure) {
    throw new OllamaCallError(
      `Model returned content that isn't valid JSON: ${rawJsonContent}`,
      parseFailure,
    )
  }

  const metrics: OllamaCallMetrics = {
    promptTokens: responseBody.prompt_eval_count ?? 0,
    outputTokens: responseBody.eval_count ?? 0,
    evalDurationMs: (responseBody.eval_duration ?? 0) / NANOS_PER_MS,
    loadDurationMs: (responseBody.load_duration ?? 0) / NANOS_PER_MS,
    totalDurationMs: (responseBody.total_duration ?? 0) / NANOS_PER_MS,
  }

  return { value: parsedValue, metrics }
}

/** True when an Ollama server appears to be reachable at the given host. */
export async function isOllamaReachable(host?: string): Promise<boolean> {
  try {
    const tagsResponse = await fetch(`${resolveHost(host)}/api/tags`)
    return tagsResponse.ok
  } catch {
    return false
  }
}

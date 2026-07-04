const DEFAULT_HOST = "http://127.0.0.1:11434"
const DEFAULT_MODEL = "qwen3"

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
}

/** Resolves the model id from an explicit value, env, or the local default. */
export function resolveModel(model?: string): string {
  return model ?? process.env.SELDON_AI_MODEL ?? DEFAULT_MODEL
}

/**
 * Calls a local Ollama `/api/chat` and returns the assistant message content.
 * Runs with `stream: false` and `temperature: 0` for deterministic, single-shot
 * responses. Inference stays on the machine; nothing leaves the local host.
 */
export async function ollamaChat({
  model,
  messages,
  format,
  host,
}: OllamaChatOptions): Promise<string> {
  const baseUrl = host ?? process.env.OLLAMA_HOST ?? DEFAULT_HOST

  let response: Response
  try {
    response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: resolveModel(model),
        messages,
        stream: false,
        format,
        options: { temperature: 0 },
      }),
    })
  } catch {
    throw new Error(
      `Could not reach Ollama at ${baseUrl}. Is it running? Start it with "ollama serve" and pull a model, for example "ollama pull qwen3".`,
    )
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "")
    throw new Error(
      `Ollama request failed (${response.status}). Is Ollama running on ${baseUrl}? ${detail}`,
    )
  }

  const data = (await response.json()) as { message?: { content?: string } }
  const content = data.message?.content
  if (typeof content !== "string") {
    throw new Error("Ollama response did not include message content.")
  }
  return content
}

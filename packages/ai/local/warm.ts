import { resolveModelId } from "../shared/model-thinking"
import type { AgentMetrics } from "../types"
import { callOllamaFormat } from "./ollama-client"

/**
 * Loads the model into Ollama and runs one trivial constrained call, so the
 * first real turn skips the cold load. There is no large system prompt to
 * prefill in this design (every resolver call is its own small prompt), so
 * warming is just forcing the model resident before the user's first message.
 */
export async function warmModel(options?: {
  model?: string
  host?: string
}): Promise<AgentMetrics> {
  const model = resolveModelId(options?.model)
  const { metrics } = await callOllamaFormat<{ ready: true }>({
    model,
    host: options?.host,
    prompt: "Reply to confirm you are ready.",
    schema: {
      type: "object",
      properties: { ready: { const: true } },
      required: ["ready"],
    },
  })
  return {
    model,
    calls: 1,
    totalMs: metrics.totalDurationMs,
    loadMs: metrics.loadDurationMs,
    promptTokens: metrics.promptTokens,
    outputTokens: metrics.outputTokens,
  }
}

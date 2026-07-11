import type {
  AgentMetrics,
  ChatToActionsInput,
  ChatToActionsResult,
} from "../types"
import { buildTurnContext } from "./editor-context"
import { createSeldonSession, createWarmSession } from "./session"

/** Renders the prior conversation as a compact block for the fresh session. */
function historyBlock(history: ChatToActionsInput["history"]): string {
  if (!history || history.length === 0) return ""
  const lines = history.map((turn) => `${turn.role}: ${turn.content}`)
  return `Conversation so far:\n${lines.join("\n")}\n\n`
}

/**
 * Runs one chat turn through the Pi tool-calling harness. Builds a hermetic
 * session with the Seldon tools, injects the volatile editor context with the
 * user request, and lets the model call tools until it is done. The mutation
 * tools validate each action against a working copy and accumulate the actions
 * the caller applies through the reducer, so this function never mutates state.
 */
export async function chatToActionsPi(
  input: ChatToActionsInput,
): Promise<ChatToActionsResult> {
  const { session, state, resolved } = await createSeldonSession(input, {
    model: input.model,
    thinkingLevel: input.thinkingLevel,
  })

  const context = buildTurnContext(resolved)

  let calls = 0
  const unsubscribe = session.subscribe((event) => {
    if (event.type === "turn_start") calls += 1
  })

  const prompt = `${historyBlock(input.history)}Current editor context:\n${context}\n\nUser request: ${input.message}`

  const started = Date.now()
  await session.prompt(prompt)
  const totalMs = Date.now() - started

  const reply = session.getLastAssistantText() ?? ""
  const stats = session.getSessionStats()
  unsubscribe()

  const outputTokens = stats.tokens.output
  const metrics: AgentMetrics = {
    model: session.model?.id ?? "unknown",
    calls,
    totalMs,
    loadMs: 0,
    promptTokens: stats.tokens.input,
    outputTokens,
    outputTokensPerSecond:
      totalMs > 0 ? outputTokens / (totalMs / 1000) : undefined,
  }

  session.dispose()

  return {
    actions: state.actions,
    reply,
    debug: {
      context,
      rawResponse: reply,
      repairs: state.repairs,
      metrics,
    },
  }
}

/**
 * Loads the model and prefills the system prompt through Pi without running an
 * edit. Returns best-effort metrics for the warm-up log.
 */
export async function warmModelPi(options?: {
  model?: string
  host?: string
}): Promise<AgentMetrics> {
  const session = await createWarmSession(options)
  const started = Date.now()
  await session.prompt("Reply with the single word: ready.")
  const totalMs = Date.now() - started
  const stats = session.getSessionStats()
  const model = session.model?.id ?? "unknown"
  session.dispose()
  return {
    model,
    calls: 1,
    totalMs,
    loadMs: 0,
    promptTokens: stats.tokens.input,
    outputTokens: stats.tokens.output,
  }
}

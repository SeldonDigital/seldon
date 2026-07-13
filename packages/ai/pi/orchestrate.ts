import type {
  AgentMetrics,
  AgentToolCall,
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
    noThink: input.noThink,
  })

  const context = buildTurnContext(resolved)
  const onEvent = input.onEvent

  let calls = 0
  let thinking = ""
  const toolCalls: AgentToolCall[] = []
  let thinkingStart: number | undefined
  let thinkingMs: number | undefined
  // Marks the thinking phase complete on the first non-thinking event, so the UI
  // can switch its label from "Thinking..." to the elapsed time while the reply
  // still streams.
  const endThinking = () => {
    if (thinkingStart === undefined || thinkingMs !== undefined) return
    thinkingMs = Date.now() - thinkingStart
    onEvent?.({ type: "thinkingDone", ms: thinkingMs })
  }
  const unsubscribe = session.subscribe((event) => {
    if (event.type === "turn_start") {
      calls += 1
    } else if (event.type === "message_update") {
      const message = event.assistantMessageEvent
      if (message.type === "thinking_delta") {
        if (thinkingStart === undefined) thinkingStart = Date.now()
        thinking += message.delta
        onEvent?.({ type: "thinking", delta: message.delta })
      } else if (message.type === "text_delta") {
        endThinking()
        onEvent?.({ type: "text", delta: message.delta })
      }
    } else if (event.type === "tool_execution_start") {
      endThinking()
      toolCalls.push({ name: event.toolName, ok: true })
      onEvent?.({ type: "tool", name: event.toolName })
    } else if (event.type === "tool_execution_end") {
      const last = toolCalls[toolCalls.length - 1]
      if (last) last.ok = !event.isError
      onEvent?.({ type: "toolResult", ok: !event.isError })
    }
  })

  const prompt = `${historyBlock(input.history)}Current editor context:\n${context}\n\nUser request: ${input.message}`

  const started = Date.now()
  await session.prompt(prompt)
  const totalMs = Date.now() - started

  endThinking()
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
      thinking: thinking.trim() ? thinking.trim() : undefined,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      thinkingMs,
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

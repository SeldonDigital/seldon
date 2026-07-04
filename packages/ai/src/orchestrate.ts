import type { WorkspaceAction } from "@seldon/core/workspace/types"
import { ollamaChat, type OllamaChatMessage } from "./ollama-client"
import { buildContext } from "./prompt/build-context"
import { buildSystemPrompt } from "./prompt/system-prompt"
import { RESPONSE_FORMAT } from "./schema/action-schema"
import type { ChatToActionsInput, ChatToActionsResult } from "./types"

/**
 * Dev-only logging. Prints the grounding context and raw model output to the
 * process that runs the agent (the Vite `npm run dev` terminal). On by default
 * outside production; set `SELDON_AI_DEBUG=0` to silence it.
 */
const DEBUG =
  process.env.SELDON_AI_DEBUG !== "0" &&
  process.env.NODE_ENV !== "production"

function debugLog(label: string, value: string): void {
  if (!DEBUG) return
  console.info(`\n[seldon/ai] ${label}:\n${value}`)
}

interface AgentEnvelope {
  reply?: string
  actions?: WorkspaceAction[]
}

function parseEnvelope(raw: string): AgentEnvelope {
  try {
    return JSON.parse(raw) as AgentEnvelope
  } catch {
    throw new Error(
      `Model did not return valid JSON. Raw response: ${raw.slice(0, 500)}`,
    )
  }
}

/**
 * Single-shot translation of a chat message into workspace actions. Builds a
 * compact grounding context from the workspace, calls the local model with a
 * schema-constrained response format, and returns the parsed actions. The caller
 * applies them through the workspace reducer; this function never mutates state.
 */
export async function chatToActions(
  input: ChatToActionsInput,
): Promise<ChatToActionsResult> {
  const context = buildContext(input.workspace, input.activeBoardKey)
  debugLog("user request", input.message)
  debugLog("grounding context", context)

  const messages: OllamaChatMessage[] = [
    { role: "system", content: buildSystemPrompt() },
  ]

  for (const turn of input.history ?? []) {
    messages.push({ role: turn.role, content: turn.content })
  }

  messages.push({
    role: "user",
    content: `Current design context:\n${context}\n\nUser request: ${input.message}`,
  })

  const raw = await ollamaChat({
    model: input.model,
    messages,
    format: RESPONSE_FORMAT,
  })

  debugLog("raw model response", raw)

  const envelope = parseEnvelope(raw)

  const actions = Array.isArray(envelope.actions) ? envelope.actions : []
  debugLog(
    "parsed actions",
    `${actions.length} action(s): ${actions.map((action) => action.type).join(", ") || "none"}`,
  )

  return {
    actions,
    reply: typeof envelope.reply === "string" ? envelope.reply : "",
  }
}

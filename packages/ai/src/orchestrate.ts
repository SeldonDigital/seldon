import type { WorkspaceAction } from "@seldon/core/workspace/types"
import { ollamaChat, type OllamaChatMessage } from "./ollama-client"
import { buildContext } from "./prompt/build-context"
import { buildSystemPrompt } from "./prompt/system-prompt"
import { ALL_ACTION_TYPES, RESPONSE_FORMAT } from "./schema/action-schema"
import type { ChatToActionsInput, ChatToActionsResult } from "./types"

const KNOWN_ACTION_TYPES = new Set(ALL_ACTION_TYPES)

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
  const context = buildContext(input.workspace, {
    activeBoardKey: input.activeBoardKey,
    selectedNodeId: input.selectedNodeId,
    selectedNodeRootId: input.selectedNodeRootId,
  })

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

  const envelope = parseEnvelope(raw)

  const parsed = Array.isArray(envelope.actions) ? envelope.actions : []

  // Structural guard: drop actions whose type is not in the allowed set. The
  // reducer validates each payload deeply when the editor applies it, so this
  // only filters hallucinated or excluded action types.
  const actions = parsed.filter((action) =>
    KNOWN_ACTION_TYPES.has(action?.type),
  )

  return {
    actions,
    reply: typeof envelope.reply === "string" ? envelope.reply : "",
    debug: { context, rawResponse: raw },
  }
}

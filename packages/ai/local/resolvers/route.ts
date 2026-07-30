import type { ChatMessage } from "../../types"
import { callOllamaFormat } from "../ollama-client"
import { type TurnContext, recordStep } from "../turn-context"

/**
 * The entry decision of a turn, unbundled from terminus's ConversationalHari:
 * one shallow-union call decides whether the message is conversation (answer
 * it directly, no processing) or a design edit (hand it to decomposition).
 * This is deliberately the ONLY judgment this call makes -- segmentation,
 * rewriting, and action labeling are separate narrower calls, so a small
 * model never faces CH's bundled four-judgments-at-once task.
 */
export type RouteDecision =
  | { kind: "reply"; message: string }
  | { kind: "process" }

/** One line per capability so a "what can you do?" reply is truthful. */
const CAPABILITY_SUMMARY =
  "You can change or reset element properties (color, size, text, spacing), rename things, add/remove/duplicate components and variants, reorder and move elements, apply themes, edit theme tokens, toggle fonts and icons, and translate text."

/** Compact `role: content` block for the prompt, mirroring the old harness. */
export function historyBlock(history?: ChatMessage[]): string {
  if (!history || history.length === 0) return ""
  const lines = history.map((turn) => `${turn.role}: ${turn.content}`)
  return `Conversation so far:\n${lines.join("\n")}\n\n`
}

/** Routes one message: conversational reply, or on to processing. */
export async function route(context: TurnContext, history?: ChatMessage[]) {
  const prompt = [
    "You are the chat assistant inside a design editor.",
    CAPABILITY_SUMMARY,
    "",
    `${historyBlock(history)}User message: ${JSON.stringify(context.message)}`,
    "",
    'If the message asks for a design change, answer {"kind":"process"}.',
    'If it is conversation (a greeting, thanks, a question about you or your capabilities), answer {"kind":"reply","message":"<your short, friendly answer>"}.',
  ].join("\n")

  const { value, metrics } = await callOllamaFormat<RouteDecision>({
    model: context.model,
    host: context.host,
    prompt,
    schema: {
      type: "object",
      oneOf: [
        {
          properties: {
            kind: { const: "reply" },
            message: { type: "string", minLength: 1 },
          },
          required: ["kind", "message"],
        },
        {
          properties: { kind: { const: "process" } },
          required: ["kind"],
        },
      ],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "route", true, {
    prompt,
    output: JSON.stringify(value, null, 2),
  })
  return value
}

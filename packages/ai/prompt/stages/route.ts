import type { ChatMessage } from "../../types"
import { type PromptStage, historyBlock } from "./shared"

/** One line per capability so a "what can you do?" reply is truthful. */
const CAPABILITY_SUMMARY =
  "You can change or reset element properties (color, size, text, spacing), rename things, add/remove/duplicate components and variants, reorder and move elements, apply themes, edit theme tokens, toggle fonts and icons, and translate text."

const ROUTE_SCHEMA = {
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
}

/** The entry decision of a turn: conversational reply, or on to processing. */
export function buildRouteStage(inputs: {
  message: string
  history?: ChatMessage[]
}): PromptStage {
  const prompt = [
    "You are the chat assistant inside a design editor.",
    CAPABILITY_SUMMARY,
    "",
    `${historyBlock(inputs.history)}User message: ${JSON.stringify(inputs.message)}`,
    "",
    'If the message asks for a design change, answer {"kind":"process"}.',
    'If it is conversation (a greeting, thanks, a question about you or your capabilities), answer {"kind":"reply","message":"<your short, friendly answer>"}.',
  ].join("\n")
  return { prompt, schema: ROUTE_SCHEMA }
}

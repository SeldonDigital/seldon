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
  hasSelection?: boolean
  /**
   * Plain-word descriptions of the elements the previous turn's ask offered,
   * so a follow-up like "which ones can I choose from?" gets the real list
   * instead of an improvised non-answer (issue 06, second half).
   */
  pendingCandidates?: string[]
}): PromptStage {
  const candidateLines =
    inputs.pendingCandidates && inputs.pendingCandidates.length > 0
      ? [
          "Your previous message asked the user to pick between these elements:",
          ...inputs.pendingCandidates.map((entry) => `- ${entry}`),
          "",
        ]
      : []
  const prompt = [
    "You are the chat assistant inside a design editor.",
    CAPABILITY_SUMMARY,
    "",
    inputs.hasSelection
      ? "The user has an element selected on the canvas."
      : "Nothing is selected on the canvas.",
    "",
    ...candidateLines,
    `${historyBlock(inputs.history)}User message: ${JSON.stringify(inputs.message)}`,
    "",
    'If the message asks for a design change, answer {"kind":"process"}, even if the element it names seems vague, unnamed, or ambiguous to you -- you cannot see the canvas, so you cannot judge that. Never ask your own "which one do you mean?" question; later steps resolve the element against the real board.',
    // A clarification round-trip must return to processing: when the
    // assistant asked "which one?" and the user answers by selecting on the
    // canvas and saying "this one", routing that BACK to a reply loops the
    // user forever (issue 02). Processing owns selection resolution.
    'If the previous assistant message asked which element was meant and this message answers it (a name, a nodeId, or "this one" with an element selected), answer {"kind":"process"}.',
    'If it is conversation (a greeting, thanks, a question about you or your capabilities), answer {"kind":"reply","message":"<your short, friendly answer>"}.',
    'If the user asks what the choices are and a pick list is shown above, answer {"kind":"reply"} listing those elements in plain words.',
  ].join("\n")
  return { prompt, schema: ROUTE_SCHEMA }
}

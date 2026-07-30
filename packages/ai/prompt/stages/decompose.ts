import type { ChatMessage } from "../../types"
import { type PromptStage, historyBlock } from "./shared"

/** Hard cap on steps per message -- a safety valve, not a product limit. */
export const MAX_STEPS = 5

const DECOMPOSE_SCHEMA = {
  type: "object",
  properties: {
    steps: {
      type: "array",
      items: { type: "string", minLength: 1 },
      minItems: 1,
      maxItems: MAX_STEPS,
    },
  },
  required: ["steps"],
}

/**
 * Splits one message into self-contained instructions. The model REWRITES
 * each step as a complete imperative sentence with pronouns resolved; it
 * never cuts the string, which is what made naive splitting produce
 * verb-less fragments and orphaned pronouns.
 */
export function buildDecomposeStage(inputs: {
  message: string
  history?: ChatMessage[]
}): PromptStage {
  const prompt = [
    "Rewrite this design-editor request as a list of independent instructions.",
    "",
    "Rules:",
    '- One instruction per distinct edit. A single edit stays ONE instruction ("make the title bold and italic" is one).',
    "- Each instruction must be a complete, self-contained imperative sentence.",
    '- Resolve pronouns: "its title" becomes "the title of the new card" when the card was created by an earlier instruction.',
    '- Refer to things created by an earlier instruction as "the new <thing>".',
    "- Do not invent steps the user did not ask for.",
    "",
    `${historyBlock(inputs.history)}Request: ${JSON.stringify(inputs.message)}`,
  ].join("\n")
  return { prompt, schema: DECOMPOSE_SCHEMA }
}

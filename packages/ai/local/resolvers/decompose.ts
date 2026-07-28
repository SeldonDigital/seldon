import type { ChatMessage } from "../../types"
import { callOllamaFormat } from "../ollama-client"
import { recordStep, type TurnContext } from "../turn-context"
import { historyBlock } from "./route"

/**
 * Splits one message into self-contained instructions -- the heart of the
 * hari flow, and the one genuinely hard model task in the whole pipeline.
 * The model REWRITES each step as a complete imperative sentence with
 * pronouns resolved ("Add a card", "Make the title in the new card red");
 * it never cuts the string, which is what made naive splitting produce
 * verb-less fragments and orphaned pronouns. A single-instruction message
 * comes back as one step, making the compound path a strict superset of the
 * old single-action behavior.
 */

/** Hard cap on steps per message -- a safety valve, not a product limit. */
export const MAX_STEPS = 5

export async function decompose(
  context: TurnContext,
  history?: ChatMessage[],
): Promise<string[]> {
  const { value, metrics } = await callOllamaFormat<{ steps: string[] }>({
    model: context.model,
    host: context.host,
    prompt: [
      "Rewrite this design-editor request as a list of independent instructions.",
      "",
      "Rules:",
      "- One instruction per distinct edit. A single edit stays ONE instruction (\"make the title bold and italic\" is one).",
      "- Each instruction must be a complete, self-contained imperative sentence.",
      "- Resolve pronouns: \"its title\" becomes \"the title of the new card\" when the card was created by an earlier instruction.",
      '- Refer to things created by an earlier instruction as "the new <thing>".',
      "- Do not invent steps the user did not ask for.",
      "",
      `${historyBlock(history)}Request: ${JSON.stringify(context.message)}`,
    ].join("\n"),
    schema: {
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
    },
  })
  context.calls.push(metrics)

  const steps = value.steps
    .map((step) => step.trim())
    .filter((step) => step !== "")
  recordStep(context, "decompose", steps.length > 0)

  // A degenerate answer degrades to the original message as one step --
  // exactly the old single-action behavior, never a dead end.
  return steps.length > 0 ? steps : [context.message]
}

import { buildDecomposeStage } from "../../prompt/stages/decompose"
import type { ChatMessage } from "../../types"
import { callOllamaFormat } from "../ollama-client"
import { type TurnContext, recordStep } from "../turn-context"

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

export async function decompose(
  context: TurnContext,
  history?: ChatMessage[],
): Promise<string[]> {
  const { prompt, schema } = buildDecomposeStage({
    message: context.message,
    history,
  })
  const { value, metrics } = await callOllamaFormat<{ steps: string[] }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)

  const steps = value.steps
    .map((step) => step.trim())
    .filter((step) => step !== "")
  recordStep(context, "decompose", steps.length > 0, {
    prompt,
    output: JSON.stringify({ steps }, null, 2),
  })

  // A degenerate answer degrades to the original message as one step --
  // exactly the old single-action behavior, never a dead end.
  return steps.length > 0 ? steps : [context.message]
}

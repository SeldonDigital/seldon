import { buildExtractTargetStage } from "../../prompt/stages/extract-target"
import { callOllamaFormat } from "../ollama-client"
import { type TurnContext, recordStep } from "../turn-context"

/**
 * What the message points at. The two facts are independent: a message can
 * point at the selection AND name an element ("make this title red"), or do
 * neither. Choosing between them belongs to the resolver -- this stage only
 * reports what the message says, so a phrase is never discarded before
 * anything has looked at the board. The model never sees the tree here.
 */
export interface TargetHint {
  /** The message uses a pronoun, or names nothing to search for. */
  pointsAtSelection: boolean
  /** The phrase naming an element, when the message names one. */
  match?: string
  /** The edit applies to every element of a kind, not one particular one. */
  plural: boolean
}

/**
 * Extracts a target hint from the message with one shallow call. A pronoun
 * ("it", "this") or an implicit target sets `pointsAtSelection`; an explicit
 * name ("the title", "all the chips") fills `match`. Both can be set at once.
 */
export async function extractTargetHint(
  context: TurnContext,
): Promise<TargetHint> {
  const { prompt, schema } = buildExtractTargetStage({
    message: context.message,
    hasSelection: context.resolved.selectedNodeId !== undefined,
  })

  const { value: rawHint, metrics } = await callOllamaFormat<{
    pointsAtSelection: boolean
    match: string
    plural: boolean
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "extract_target", {
    ok: true,
    prompt,
    output: JSON.stringify(rawHint, null, 2),
  })

  const searchPhrase = (rawHint.match ?? "").trim()
  return {
    pointsAtSelection: rawHint.pointsAtSelection,
    match: searchPhrase === "" ? undefined : searchPhrase,
    // Plural without a phrase is meaningless: there is no class to match.
    plural: rawHint.plural && searchPhrase !== "",
  }
}

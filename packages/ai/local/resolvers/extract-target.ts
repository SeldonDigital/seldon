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
  /** A bounded plural's requested size ("the top two"), when named. */
  count?: number
}

/**
 * Rejoins the separately-asked element parts into the one phrase the search
 * path expects. The stage asks for the noun and its describing words apart so
 * a property name cannot compete with the element name for a single slot
 * (issue 07); nothing downstream reads them apart, so they are put back
 * together here. An unnamed element wins over any descriptor: describing
 * words with no noun name no element to find.
 */
function composeSearchPhrase(descriptor: string, baseNode: string): string {
  const namedElement = baseNode.trim()
  if (namedElement === "") return ""
  return `${descriptor.trim()} ${namedElement}`.trim().replace(/\s+/g, " ")
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
    baseNode: string
    descriptor: string
    plural: boolean
    count: number
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

  const searchPhrase = composeSearchPhrase(
    rawHint.descriptor ?? "",
    rawHint.baseNode ?? "",
  )
  // 0 is the sentinel for "no number was named", mirroring match's "" -> undefined.
  // A count without a phrase is as meaningless as plural without one -- there
  // is no class to narrow.
  const requestedCount =
    rawHint.count > 0 && searchPhrase !== "" ? rawHint.count : undefined
  return {
    pointsAtSelection: rawHint.pointsAtSelection,
    match: searchPhrase === "" ? undefined : searchPhrase,
    // Plural without a phrase is meaningless: there is no class to match.
    // A named count implies plural even if the model's own boolean waffles.
    plural: (rawHint.plural || requestedCount !== undefined) && searchPhrase !== "",
    count: requestedCount,
  }
}

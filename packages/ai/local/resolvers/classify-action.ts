import {
  buildPickFamilyStage,
  buildPickIntentStage,
} from "../../prompt/stages/classify-action"
import {
  type V1Family,
  type V1Intent,
  V1_FAMILY_KEYS,
  V1_INTENT_BY_KEY,
  V1_INTENTS_BY_FAMILY,
  soleIntentOfFamily,
} from "../../schema/v1-vocabulary"
import type { SelectionScope } from "../../types"
import { type OllamaCallMetrics, callOllamaFormat } from "../ollama-client"

/**
 * Outcome of classifying a chat message into one v1 intent. `classified`
 * carries the vocabulary entry to dispatch. `message` is a terminal reply for
 * a non-edit message (the `none` escape), following the uniform contract:
 * resolve, or hand back one terminal message -- never guess.
 *
 * `metrics` is a list because classification is two calls, not one: reporting
 * a single aggregate would undercount the turn's calls in the eval and the
 * transcript.
 */
export type ActionClassification =
  | {
      kind: "classified"
      intent: V1Intent
      /** The family the first pick chose, for the transcript's step detail. */
      family: V1Family
      metrics: readonly OllamaCallMetrics[]
      /** Both classifier prompts, surfaced for the transcript's step detail. */
      prompt: string
    }
  | {
      kind: "message"
      text: string
      metrics: readonly OllamaCallMetrics[]
      /** Both classifier prompts, surfaced for the transcript's step detail. */
      prompt: string
      /**
       * The key the model actually answered. Distinguishes a deliberate
       * "none" from an unknown key that failed the vocabulary lookup -- both
       * end the turn the same way, but only one is a classifier fault.
       */
      rawIntent: string
    }

const NON_EDIT_REPLY =
  "I can only make design edits right now: set or reset properties, rename, add or remove components and variants, reorder, apply themes, edit theme tokens, toggle fonts and icons, or translate text. Tell me what to change and where."

/**
 * Whether the answer names a family that leads to a real edit: one the
 * vocabulary has, and not the `none` escape. Both failures end the turn the
 * same way, so one guard covers them -- and excluding `none` from the type
 * keeps the rest of this function from having to consider it.
 */
function isEditFamily(answer: string): answer is Exclude<V1Family, "none"> {
  const familyExists = (V1_FAMILY_KEYS as readonly string[]).includes(answer)
  return familyExists && answer !== "none"
}

/** Both calls' prompts in one block, with the family pick's answer between them. */
function transcriptDetail(
  familyPrompt: string,
  pickedFamily: string,
  intentPrompt?: string,
): string {
  const familyBlock = `[1/2 family pick]\n${familyPrompt}\n\n-> family: ${pickedFamily}`
  if (intentPrompt === undefined) {
    return `${familyBlock}\n\n[2/2 member pick skipped: the family has one member]`
  }
  return `${familyBlock}\n\n[2/2 member pick]\n${intentPrompt}`
}

/**
 * Classifies one chat message into a v1 intent with two enum-constrained calls:
 * which family of edits, then which member of that family.
 *
 * It was one 24-way call. Four times running, a structural noun in the message
 * outweighed its verb and the answer landed on a sibling intent that then
 * executed -- "add a chip to the new variant" created a variant, "rename the
 * second variant to Compact" created one too. Three of those were repaired by
 * tuning the losing intent's description, and the fourth arrived anyway,
 * because the descriptions cross-talk: a verb-anchoring clause added to reset
 * flipped an unrelated add_component case. The tripwire in the vocabulary said
 * a fourth means stop tuning.
 *
 * Splitting the choice attacks the cause instead. The family pick is described
 * purely by verbs, so a noun has no family to steal; the member pick then sees
 * only that family's two-to-five siblings, so the intent that used to be stolen
 * is not on the list at all. A single-member family skips the second call,
 * since the first already named the intent.
 */
export async function classifyAction(options: {
  message: string
  scope?: SelectionScope
  hasSelectedNode?: boolean
  model?: string
  host?: string
}): Promise<ActionClassification> {
  const familyStage = buildPickFamilyStage({
    message: options.message,
    scope: options.scope,
    hasSelectedNode: options.hasSelectedNode,
  })
  const { value: familyAnswer, metrics: familyMetrics } =
    await callOllamaFormat<{ family: string }>({
      model: options.model,
      host: options.host,
      prompt: familyStage.prompt,
      schema: familyStage.schema,
    })

  // A deliberate "none" and an unknown key (which the enum constraint makes
  // nearly impossible) both terminate cleanly rather than dispatch nothing.
  // `rawIntent` keeps them apart for the eval.
  const answeredFamily = familyAnswer.family
  const messageIsNotAnEdit = !isEditFamily(answeredFamily)
  if (messageIsNotAnEdit) {
    return {
      kind: "message",
      text: NON_EDIT_REPLY,
      metrics: [familyMetrics],
      prompt: transcriptDetail(familyStage.prompt, answeredFamily),
      rawIntent: answeredFamily,
    }
  }

  const pickedFamily = answeredFamily
  // One member means the family pick already answered the whole question.
  const onlyMember = soleIntentOfFamily(pickedFamily)
  if (onlyMember !== undefined) {
    return {
      kind: "classified",
      intent: onlyMember,
      family: pickedFamily,
      metrics: [familyMetrics],
      prompt: transcriptDetail(familyStage.prompt, pickedFamily),
    }
  }

  const intentStage = buildPickIntentStage({
    message: options.message,
    family: pickedFamily,
    scope: options.scope,
    hasSelectedNode: options.hasSelectedNode,
  })
  const { value: intentAnswer, metrics: intentMetrics } =
    await callOllamaFormat<{ intent: string }>({
      model: options.model,
      host: options.host,
      prompt: intentStage.prompt,
      schema: intentStage.schema,
    })

  const matchedIntent = V1_INTENT_BY_KEY.get(intentAnswer.intent)
  const familyMembers = V1_INTENTS_BY_FAMILY.get(pickedFamily) ?? []
  // A member from a DIFFERENT family would mean the enum was ignored, which
  // must fail loudly as a classifier fault rather than dispatch across
  // families on the strength of a malformed answer.
  const answerIsNotAMemberOfThisFamily =
    matchedIntent === undefined || !familyMembers.includes(matchedIntent)
  const detail = transcriptDetail(
    familyStage.prompt,
    pickedFamily,
    intentStage.prompt,
  )
  if (answerIsNotAMemberOfThisFamily) {
    return {
      kind: "message",
      text: NON_EDIT_REPLY,
      metrics: [familyMetrics, intentMetrics],
      prompt: detail,
      rawIntent: intentAnswer.intent,
    }
  }

  return {
    kind: "classified",
    intent: matchedIntent,
    family: pickedFamily,
    metrics: [familyMetrics, intentMetrics],
    prompt: detail,
  }
}

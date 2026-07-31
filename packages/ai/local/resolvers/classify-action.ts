import { buildClassifyActionStage } from "../../prompt/stages/classify-action"
import { type V1Intent, V1_INTENT_BY_KEY } from "../../schema/v1-vocabulary"
import type { SelectionScope } from "../../types"
import { type OllamaCallMetrics, callOllamaFormat } from "../ollama-client"

/**
 * Outcome of classifying a chat message into one v1 intent. `classified`
 * carries the vocabulary entry to dispatch. `message` is a terminal reply for
 * a non-edit message (the `none` escape), following the uniform contract:
 * resolve, or hand back one terminal message -- never guess.
 */
export type ActionClassification =
  | {
      kind: "classified"
      intent: V1Intent
      metrics: OllamaCallMetrics
      /** The classifier prompt, surfaced for the transcript's step detail. */
      prompt: string
    }
  | {
      kind: "message"
      text: string
      metrics: OllamaCallMetrics
      /** The classifier prompt, surfaced for the transcript's step detail. */
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
 * Classifies one chat message into a v1 intent with a single enum-constrained
 * call. The schema restricts the answer to the vocabulary's intent keys, so
 * the model cannot invent an action -- its only judgment is which listed
 * intent fits, with `none` as the escape for non-edit messages.
 */
export async function classifyAction(options: {
  message: string
  scope?: SelectionScope
  hasSelectedNode?: boolean
  model?: string
  host?: string
}): Promise<ActionClassification> {
  const { prompt, schema } = buildClassifyActionStage({
    message: options.message,
    scope: options.scope,
    hasSelectedNode: options.hasSelectedNode,
  })
  const { value: classifierAnswer, metrics } = await callOllamaFormat<{
    intent: string
  }>({
    model: options.model,
    host: options.host,
    prompt,
    schema,
  })

  const matchedIntent = V1_INTENT_BY_KEY.get(classifierAnswer.intent)
  // The enum constraint makes an unknown key nearly impossible, but a lookup
  // miss must still terminate cleanly rather than dispatch nothing.
  const messageIsNotAnEdit =
    matchedIntent === undefined || matchedIntent.intent === "none"
  if (messageIsNotAnEdit) {
    return {
      kind: "message",
      text: NON_EDIT_REPLY,
      metrics,
      prompt,
      rawIntent: classifierAnswer.intent,
    }
  }
  return { kind: "classified", intent: matchedIntent, metrics, prompt }
}

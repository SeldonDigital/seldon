/**
 * TEMPORARY measurement scaffolding for the cardinality work.
 *
 * The question this answers: can the local model tell "the chip" from "all the
 * chips" -- that is, does the message name one particular element, or a class
 * of elements? Reference intent is the only half of cardinality the model can
 * possibly know, since it never sees the tree; the count comes from matching
 * the phrase against the board.
 *
 * This lives in eval/ rather than prompt/stages/ on purpose. It is a probe, not
 * a pipeline stage -- nothing in local/ imports it. If the numbers hold up, the
 * field folds into `buildExtractTargetStage` and this file is deleted.
 */
import { callOllamaFormat } from "../local/ollama-client"

export type ReferenceIntent = "single" | "class"

const SCHEMA = {
  type: "object",
  properties: { intent: { type: "string", enum: ["single", "class"] } },
  required: ["intent"],
}

/** The probe prompt: message in, single/class out, tree never mentioned. */
export function buildReferenceIntentProbe(message: string): string {
  return [
    "A design-editor chat message refers to element(s) on the canvas.",
    "Decide whether it names ONE element, or a CLASS of elements to act on together.",
    "",
    "Judge by the grammatical number of the noun the edit applies to.",
    'Singular noun -> "single", even with a quantifier: "all of the text" is one text element.',
    'Plural noun -> "class": "the chips", "all the chips", "each chip" are all a class.',
    "",
    // Examples are deliberately drawn from vocabulary the eval cases do NOT
    // use, so the probe is scored on generalization rather than recall.
    "Examples:",
    '  "widen the sidebar" -> single',
    '  "clear all of the padding on the footer" -> single',
    '  "round the avatars" -> class',
    '  "give every tab an underline" -> class',
    "",
    `Message: ${JSON.stringify(message)}`,
  ].join("\n")
}

/** Runs the probe once. Returns the model's pick. */
export async function probeReferenceIntent(
  message: string,
  model: string,
): Promise<ReferenceIntent> {
  const { value } = await callOllamaFormat<{ intent: ReferenceIntent }>({
    model,
    prompt: buildReferenceIntentProbe(message),
    schema: SCHEMA,
  })
  return value.intent
}

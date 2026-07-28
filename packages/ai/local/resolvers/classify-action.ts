import {
  type V1Intent,
  V1_INTENTS,
  V1_INTENT_BY_KEY,
  V1_INTENT_KEYS,
} from "../../schema/v1-vocabulary"
import type { SelectionScope } from "../../types"
import { type OllamaCallMetrics, callOllamaFormat } from "../ollama-client"

/**
 * Outcome of classifying a chat message into one v1 intent. `classified`
 * carries the vocabulary entry to dispatch. `message` is a terminal reply for
 * a non-edit message (the `none` escape), following the uniform contract:
 * resolve, or hand back one terminal message -- never guess.
 */
export type ActionClassification =
  | { kind: "classified"; intent: V1Intent; metrics: OllamaCallMetrics }
  | { kind: "message"; text: string; metrics: OllamaCallMetrics }

const NONE_REPLY =
  "I can only make design edits right now: set or reset properties, rename, add or remove components and variants, reorder, apply themes, edit theme tokens, toggle fonts and icons, or translate text. Tell me what to change and where."

/** The intent catalog block of the classifier prompt, one line per intent. */
export function buildIntentCatalog(): string {
  return V1_INTENTS.map(
    (entry) => `- ${entry.intent}: ${entry.description}`,
  ).join("\n")
}

/**
 * Builds the classifier prompt. Deliberately small: the intent catalog, a
 * one-line hint about what is selected (an "make it red" style message reads
 * differently against a selected node than against nothing), and the message.
 * No workspace tree is serialized here -- classification only decides WHAT
 * kind of edit this is; resolving WHERE happens in later, narrower calls.
 */
export function buildClassifierPrompt(
  message: string,
  scope?: SelectionScope,
  hasSelectedNode?: boolean,
): string {
  const selectionHint = hasSelectedNode
    ? `The user has a node selected (scope: ${scope ?? "instance"}).`
    : `Nothing specific is selected (scope: ${scope ?? "board"}).`
  return [
    "You classify one design-editor chat message into exactly one intent from this catalog:",
    "",
    buildIntentCatalog(),
    "",
    selectionHint,
    "",
    `Message: ${JSON.stringify(message)}`,
    "",
    'Pick the single best matching intent. If the message is not a design edit, pick "none".',
  ].join("\n")
}

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
  const prompt = buildClassifierPrompt(
    options.message,
    options.scope,
    options.hasSelectedNode,
  )
  const { value, metrics } = await callOllamaFormat<{ intent: string }>({
    model: options.model,
    host: options.host,
    prompt,
    schema: {
      type: "object",
      properties: { intent: { type: "string", enum: [...V1_INTENT_KEYS] } },
      required: ["intent"],
    },
  })

  const entry = V1_INTENT_BY_KEY.get(value.intent)
  // The enum constraint makes an unknown key nearly impossible, but a lookup
  // miss must still terminate cleanly rather than dispatch nothing.
  if (!entry || entry.intent === "none") {
    return { kind: "message", text: NONE_REPLY, metrics }
  }
  return { kind: "classified", intent: entry, metrics }
}

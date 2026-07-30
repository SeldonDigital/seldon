import { V1_INTENTS, V1_INTENT_KEYS } from "../../schema/v1-vocabulary"
import type { SelectionScope } from "../../types"
import type { PromptStage } from "./shared"

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

const CLASSIFY_SCHEMA = {
  type: "object",
  properties: { intent: { type: "string", enum: [...V1_INTENT_KEYS] } },
  required: ["intent"],
}

/**
 * The classifier call: the schema restricts the answer to the vocabulary's
 * intent keys, so the model cannot invent an action -- its only judgment is
 * which listed intent fits, with `none` as the escape for non-edit messages.
 */
export function buildClassifyActionStage(inputs: {
  message: string
  scope?: SelectionScope
  hasSelectedNode?: boolean
}): PromptStage {
  return {
    prompt: buildClassifierPrompt(
      inputs.message,
      inputs.scope,
      inputs.hasSelectedNode,
    ),
    schema: CLASSIFY_SCHEMA,
  }
}

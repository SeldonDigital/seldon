import type { PromptStage } from "./shared"

/**
 * Two independent facts, not a choice between them. An either/or here is
 * lossy: answering "selection" throws the phrase away, and nothing downstream
 * can recover it -- so a message that names an element but gets misread as a
 * pronoun reference has nowhere left to go. Both fields are always required;
 * `match` is "" only when the message names nothing at all.
 */
const EXTRACT_TARGET_SCHEMA = {
  type: "object",
  properties: {
    pointsAtSelection: { type: "boolean" },
    match: { type: "string" },
  },
  required: ["pointsAtSelection", "match"],
}

/**
 * One shallow call: does the message point at the selection, and does it name
 * an element to find? The model never sees the tree here, it only reads the
 * message. Priority between the two answers belongs to the resolver, not this
 * stage -- which is why both are collected even when they overlap.
 */
export function buildExtractTargetStage(inputs: {
  message: string
  hasSelection: boolean
}): PromptStage {
  const prompt = [
    "A design-editor chat message can point at the currently selected element, name an element to find, or both.",
    "Answer BOTH questions independently. Neither answer suppresses the other.",
    inputs.hasSelection
      ? "The user HAS an element selected."
      : "The user has NOTHING selected.",
    "",
    `Message: ${JSON.stringify(inputs.message)}`,
    "",
    'pointsAtSelection: true when the message uses a pronoun ("it", "this", "that") or names no element at all.',
    "match: the shortest phrase naming an element, e.g. 'title' or 'hero heading'. Give the bare noun phrase, no leading article.",
    'Set match to "" ONLY when the message names no element whatsoever.',
    'A plural or quantified phrase is still a name: "all the chips" -> match "chips", "every tab" -> match "tabs".',
  ].join("\n")
  return { prompt, schema: EXTRACT_TARGET_SCHEMA }
}

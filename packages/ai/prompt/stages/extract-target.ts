import type { PromptStage } from "./shared"

/**
 * Two independent facts, not a choice between them. An either/or here is
 * lossy: answering "selection" throws the phrase away, and nothing downstream
 * can recover it -- so a message that names an element but gets misread as a
 * pronoun reference has nowhere left to go. Both fields are always required;
 * `match` is "" only when the message names nothing at all.
 *
 * `plural` is the cardinality signal: does the edit apply to one element or a
 * class of them? It is judged from grammatical number alone -- the count of
 * actual matches comes from the board, not from here. Interim shape: a
 * query-parse stage with a `count` field (terminus's descriptor parse) is the
 * planned replacement.
 */
const EXTRACT_TARGET_SCHEMA = {
  type: "object",
  properties: {
    pointsAtSelection: { type: "boolean" },
    match: { type: "string" },
    plural: { type: "boolean" },
    count: { type: "integer" },
  },
  required: ["pointsAtSelection", "match", "plural", "count"],
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
    "plural: true when the edit applies to every element of a kind, judged by the grammatical number of the noun the edit applies to.",
    'Plural noun -> true: "the chips", "all the chips", "each tab". Singular noun -> false, even with a quantifier: "all of the text" is one element.',
    'count: the number named for a BOUNDED plural reference, e.g. "the top two texts" -> 2, "the two chips about cars" -> 2. Set count to 0 when no number is named -- a plain plural like "all the chips" or "the chips" is unbounded -> 0.',
    'A named count still means plural: true, even if the noun looks singular: "the top 2 text" -> plural true, count 2.',
  ].join("\n")
  return { prompt, schema: EXTRACT_TARGET_SCHEMA }
}

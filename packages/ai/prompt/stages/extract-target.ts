import type { PromptStage } from "./shared"

/**
 * Two independent facts, not a choice between them. An either/or here is
 * lossy: answering "selection" throws the phrase away, and nothing downstream
 * can recover it -- so a message that names an element but gets misread as a
 * pronoun reference has nowhere left to go. Both fields are always required;
 * `baseNode` is "" only when the message names nothing at all.
 *
 * The element is asked for in two parts rather than as one phrase. A single
 * slot forced the noun naming the element to compete with the noun naming the
 * property: "set the width of all the chips" answered "" or "width" often
 * enough to kill the turn (issue 07). Asking "which element?" and "which one
 * of them?" separately removes the slot the confusion lived in. The parts are
 * rejoined into one search phrase by the resolver -- the split exists to make
 * the model's job unambiguous, not because anything downstream reads them
 * apart.
 *
 * There is no `plural` field here. It used to be asked of the model as the
 * cardinality signal, judged from grammatical number alone -- but qwen3
 * deterministically answered `plural: true` for singular, position-named
 * references ("the last chip", "the first list item"), fanning a
 * single-element edit over every match on the board, and a prompt fix (more
 * singular examples) did not generalize to new phrasings (issue 10). The
 * resolver now derives it in code from `baseNode`'s own grammatical number
 * (see `nounIsPlural` in `local/resolvers/extract-target.ts`), which is
 * exactly what this split already hands it.
 */
const EXTRACT_TARGET_SCHEMA = {
  type: "object",
  properties: {
    pointsAtSelection: { type: "boolean" },
    baseNode: { type: "string" },
    descriptor: { type: "string" },
    count: { type: "integer" },
  },
  required: ["pointsAtSelection", "baseNode", "descriptor", "count"],
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
    "baseNode: the bare noun naming the element to act on, e.g. 'title', 'chip', 'button'. No leading article, no describing words.",
    'A property being changed is NEVER the baseNode. In "the width of the chips", "width" is the property and "chips" is the element, so baseNode is "chips":',
    '  "set the width of all the chips to 100 pixels" -> baseNode "chips"',
    '  "set the display property of the icon to none" -> baseNode "icon"',
    '  "make the title of the second card bold" -> baseNode "title"',
    '  "translate the <something> text into <language>" -> baseNode "text", descriptor "<something>" (the element whose content gets transformed; the language is not an element and not a descriptor)',
    'Set baseNode to "" ONLY when the message names no element whatsoever.',
    'A plural or quantified phrase is still a name: "all the chips" -> baseNode "chips", "every tab" -> baseNode "tabs".',
    "descriptor: the words that say WHICH of several elements is meant -- its position (\"last\", \"second\") or a quality it ALREADY has (\"red\", \"with round corners\"). Use \"\" when the message gives none.",
    'A value being commanded is NEVER a descriptor: "make the last button green" -> baseNode "button", descriptor "last" (green is the new value, not a description of which button).',
    'count: the number named for a BOUNDED plural reference, e.g. "the top two texts" -> 2, "the two chips about cars" -> 2. Set count to 0 when no number is named -- a plain plural like "all the chips" or "the chips" is unbounded -> 0.',
    'A number directly before the noun is the count even when a description trails the noun: "the two cards about pricing" -> count 2, "the three tabs with icons" -> count 3.',
    'A named count still counts even when the noun looks singular: "the top 2 text" -> count 2.',
  ].join("\n")
  return { prompt, schema: EXTRACT_TARGET_SCHEMA }
}

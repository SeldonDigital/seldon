import type { PromptStage } from "./shared"

const EXTRACT_TARGET_SCHEMA = {
  type: "object",
  oneOf: [
    {
      properties: { kind: { const: "selection" } },
      required: ["kind"],
    },
    {
      properties: {
        kind: { const: "search" },
        match: { type: "string" },
      },
      required: ["kind", "match"],
    },
  ],
}

/**
 * One shallow-union call: does the message point at the selection, or name an
 * element to find? The model never sees the tree here, it only reads the
 * message.
 */
export function buildExtractTargetStage(inputs: {
  message: string
  hasSelection: boolean
}): PromptStage {
  const prompt = [
    "A design-editor chat message either refers to the currently selected element or names an element to find.",
    inputs.hasSelection
      ? "The user HAS an element selected."
      : "The user has NOTHING selected, so a bare pronoun still needs a search phrase when the message names anything at all.",
    "",
    `Message: ${JSON.stringify(inputs.message)}`,
    "",
    'If the message uses a pronoun ("it", "this") or names no element, answer {"kind":"selection"}.',
    'If it names an element, answer {"kind":"search","match":"<the shortest phrase naming it, e.g. \'title\' or \'hero heading\'>"}.',
  ].join("\n")
  return { prompt, schema: EXTRACT_TARGET_SCHEMA }
}

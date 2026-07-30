import type { PromptStage } from "./shared"

/**
 * Picks which of the component's settable property keys the message asks to
 * change. The schema's item enum is the same key list the prompt renders, so
 * the model can only answer from the menu it was shown.
 */
export function buildResolvePropertyNamesStage(inputs: {
  message: string
  catalogId: string
  keys: string[]
}): PromptStage {
  const prompt = [
    `A user wants to change one or more properties of a "${inputs.catalogId}" element.`,
    "",
    `Message: ${JSON.stringify(inputs.message)}`,
    "",
    "Settable property keys:",
    inputs.keys.map((key) => `- ${key}`).join("\n"),
    "",
    "Answer with the key(s) the message asks to change. Pick only keys from the list.",
  ].join("\n")
  return {
    prompt,
    schema: {
      type: "object",
      properties: {
        keys: {
          type: "array",
          items: { type: "string", enum: inputs.keys },
          minItems: 1,
        },
      },
      required: ["keys"],
    },
  }
}

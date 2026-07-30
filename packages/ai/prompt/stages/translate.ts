import type { PromptStage } from "./shared"

/**
 * Translates a batch of strings in ONE call. The schema locks the answer to
 * exactly the input length -- a silently short or reordered batch would write
 * the wrong text to the wrong node.
 */
export function buildTranslateBatchStage(inputs: {
  texts: readonly string[]
  language: string
}): PromptStage {
  const prompt = [
    `Translate each of these texts into ${inputs.language}.`,
    "Answer with the translations in the SAME order, one per input, nothing added or dropped.",
    "",
    ...inputs.texts.map((text, index) => `${index + 1}. ${JSON.stringify(text)}`),
  ].join("\n")
  return {
    prompt,
    schema: {
      type: "object",
      properties: {
        translations: {
          type: "array",
          items: { type: "string" },
          minItems: inputs.texts.length,
          maxItems: inputs.texts.length,
        },
      },
      required: ["translations"],
    },
  }
}

const TEXT_DIRECTION_SCHEMA = {
  type: "object",
  properties: { direction: { type: "string", enum: ["ltr", "rtl"] } },
  required: ["direction"],
}

/** The text direction the target language reads in, as one tiny enum call. */
export function buildTextDirectionStage(inputs: {
  language: string
}): PromptStage {
  return {
    prompt: `Does ${inputs.language} read left-to-right ("ltr") or right-to-left ("rtl")?`,
    schema: TEXT_DIRECTION_SCHEMA,
  }
}

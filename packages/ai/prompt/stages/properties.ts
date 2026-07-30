import type { PromptStage } from "./shared"

const SET_LABEL_SCHEMA = {
  type: "object",
  properties: { label: { type: "string", minLength: 1 } },
  required: ["label"],
}

/** Extracts the new name for a rename, verbatim from the message. */
export function buildSetLabelStage(inputs: { message: string }): PromptStage {
  const prompt = [
    "Extract the new name the user wants from this message.",
    `Message: ${JSON.stringify(inputs.message)}`,
    'Answer with {"label": "<the new name, verbatim>"}.',
  ].join("\n")
  return { prompt, schema: SET_LABEL_SCHEMA }
}

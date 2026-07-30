import type { PromptStage } from "./shared"

const TRANSLATE_LANGUAGE_PICK_SCHEMA = {
  type: "object",
  properties: { language: { type: "string", minLength: 2 } },
  required: ["language"],
}

/** Which language the user wants the text translated into. */
export function buildTranslateLanguagePickStage(inputs: {
  message: string
}): PromptStage {
  const prompt = [
    "Which language does the user want the text translated into?",
    `Message: ${JSON.stringify(inputs.message)}`,
    'Answer with the language name, like "Spanish" or "Japanese".',
  ].join("\n")
  return { prompt, schema: TRANSLATE_LANGUAGE_PICK_SCHEMA }
}

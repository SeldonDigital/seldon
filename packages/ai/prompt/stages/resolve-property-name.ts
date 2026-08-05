import type { PromptStage } from "./shared"

/**
 * The message's own words, lowercased and deduped: the only values the
 * evidence field can take. Enum-constraining evidence to these makes pointing
 * at a word the model invented impossible -- it can only cite what the user
 * actually typed.
 */
export function messageWords(message: string): string[] {
  const words = message
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
  return [...new Set(words)]
}

/**
 * The escape answer for a message that names only a color value and no
 * property word ("make it red"). Without it the key enum forces a guess, and
 * the guess lands on an invisible property as often as not (the chip-red
 * live failure wrote the foreground of a surface). With it the choice of key
 * moves to code (`defaultColorKeyFor`), which reads the component's own
 * schema instead of guessing.
 */
export const BARE_COLOR_ANSWER = "bare_color_value"

/**
 * Picks which of the component's settable property keys the message asks to
 * change. The schema's key enum is the same key list the prompt renders, so
 * the model can only answer from the menu it was shown.
 *
 * Every pick must also point at the message word that names it
 * (`evidenceWord`, enum-constrained to the message's own words). The enum
 * grammar guarantees an answer from the key menu even when the message names
 * no property at all -- "hide the top two chips" picked `position.top` live,
 * reading the target descriptor as a property word. The evidence makes that
 * failure visible to code: the resolver rejects picks whose evidence sits in
 * the already-extracted target phrase, so a target word cannot silently
 * become a property choice.
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
    "Answer with the key(s) the message asks to change, and for each key the",
    "single word in the message that names that property. Pick only keys from",
    "the list and only words from the message.",
    `If the message names only a color value and no property ("make it red", "turn the chips blue"), answer with the single key "${BARE_COLOR_ANSWER}" and the color word as its evidence.`,
  ].join("\n")
  return {
    prompt,
    schema: {
      type: "object",
      properties: {
        picks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              key: {
                type: "string",
                enum: [...inputs.keys, BARE_COLOR_ANSWER],
              },
              evidenceWord: {
                type: "string",
                enum: messageWords(inputs.message),
              },
            },
            required: ["key", "evidenceWord"],
          },
          minItems: 1,
        },
      },
      required: ["picks"],
    },
  }
}

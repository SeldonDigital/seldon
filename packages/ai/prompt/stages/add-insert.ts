import type { PromptStage } from "./shared"

/**
 * Extracts which component to add and where, constrained to real catalog ids.
 * An empty "destination" covers a message that names no destination.
 */
export function buildExtractAddRequestStage(inputs: {
  message: string
  catalogIds: string[]
}): PromptStage {
  const prompt = [
    "A user wants to add a component in a design editor.",
    `Message: ${JSON.stringify(inputs.message)}`,
    "",
    "Available component ids:",
    inputs.catalogIds.join(", "),
    "",
    'Pick the component id that best matches what the user asked to add. For "destination", extract the shortest phrase naming where it should go, or an empty string when the message names no destination.',
  ].join("\n")
  return {
    prompt,
    schema: {
      type: "object",
      properties: {
        component: { type: "string", enum: inputs.catalogIds },
        destination: { type: "string" },
      },
      required: ["component", "destination"],
    },
  }
}

/** Picks one of the active board's variants by enum, plus a destination. */
export function buildPickVariantStage(inputs: {
  message: string
  variants: Array<{ id: string; label: string }>
}): PromptStage {
  const prompt = [
    "A user wants to insert an instance of one of these variants:",
    inputs.variants.map((entry) => `- ${entry.id}: "${entry.label}"`).join("\n"),
    "",
    `Message: ${JSON.stringify(inputs.message)}`,
    "",
    'Pick the variant and extract the shortest phrase naming where it goes ("destination" -- empty string when the message means the current selection).',
  ].join("\n")
  return {
    prompt,
    schema: {
      type: "object",
      properties: {
        variantId: {
          type: "string",
          enum: inputs.variants.map((entry) => entry.id),
        },
        destination: { type: "string" },
      },
      required: ["variantId", "destination"],
    },
  }
}

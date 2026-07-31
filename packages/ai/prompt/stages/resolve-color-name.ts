import type { PromptStage } from "./shared"

/** One theme swatch the model may pick, with its rendered color for context. */
export interface ColorSwatchChoice {
  /** Swatch key as stored in the theme table, e.g. "primary". */
  key: string
  /** Display line for the prompt, e.g. `primary (Primary, hsl(210, 100%, 50%))`. */
  label: string
}

export interface ResolveColorNameInputs {
  propertyKey: string
  message: string
  /** Swatches of the workspace's theme (caller-derived, may be empty). */
  swatches: ColorSwatchChoice[]
}

/**
 * First half of the color-value pipeline: identify WHICH color the user asked
 * for, never what code it has. The model answers with either a theme swatch
 * key (enum-constrained to real swatches) or the color phrase verbatim; a
 * deterministic cascade in local/resolvers/resolve-color-value.ts maps the
 * phrase to a storable value. Splitting naming from encoding is what keeps an
 * invalid color value unrepresentable: the model is never asked to write one.
 * Branches and guidance lines are built in lockstep, mirroring
 * resolve-property-value.ts.
 */
export function buildResolveColorNameStage(
  inputs: ResolveColorNameInputs,
): PromptStage {
  const branches: Record<string, unknown>[] = []
  const guidance: string[] = []
  const themeHasSwatches = inputs.swatches.length > 0
  if (themeHasSwatches) {
    branches.push({
      properties: {
        pick: { const: "swatch" },
        value: {
          type: "string",
          enum: inputs.swatches.map((swatch) => swatch.key),
        },
      },
      required: ["pick", "value"],
    })
    guidance.push(
      ...inputs.swatches.map((swatch) => `- ${swatch.label}`),
      "",
      'Pick "swatch" only when the message names a swatch or asks for a color that clearly matches a swatch\'s rendered color. Never guess the closest swatch.',
    )
  }
  branches.push({
    properties: {
      pick: { const: "color" },
      value: { type: "string" },
    },
    required: ["pick", "value"],
  })
  guidance.push(
    `${themeHasSwatches ? "Otherwise pick" : "Pick"} "color" and repeat the color exactly as the user said it (for example "orange", "hot pink", "#ff0000").`,
  )

  const prompt = [
    `A user wants to set the "${inputs.propertyKey}" property of a design element. Identify which color they are asking for.`,
    "",
    `Message: ${JSON.stringify(inputs.message)}`,
    "",
    ...(themeHasSwatches ? ["Theme swatches:"] : []),
    ...guidance,
  ].join("\n")

  return { prompt, schema: { type: "object", oneOf: branches } }
}

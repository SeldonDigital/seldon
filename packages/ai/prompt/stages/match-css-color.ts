import type { PromptStage } from "./shared"

export interface MatchCssColorInputs {
  /** The color phrase that failed every deterministic lookup, verbatim. */
  colorPhrase: string
  /** The CSS named colors the model may choose from (caller-derived). */
  cssColorNames: string[]
}

/**
 * Fallback stage for color phrases outside the CSS named-color list, such as
 * "terracotta" or "dark purple". The model picks the closest CSS color NAME
 * from a closed enum -- the hex always comes from the caller's table, so a
 * hallucinated color value cannot reach the reducer. The "none" branch is the
 * escape for phrases that do not describe a color at all; without it the
 * schema would force a color onto nonsense input.
 */
export function buildMatchCssColorStage(
  inputs: MatchCssColorInputs,
): PromptStage {
  const branches: Record<string, unknown>[] = [
    {
      properties: {
        pick: { const: "css" },
        value: { type: "string", enum: inputs.cssColorNames },
      },
      required: ["pick", "value"],
    },
    {
      properties: {
        pick: { const: "none" },
      },
      required: ["pick"],
    },
  ]

  const prompt = [
    `Map the color description ${JSON.stringify(inputs.colorPhrase)} to the CSS named color that comes closest to it. For example, "terracotta" maps to "indianred" and "dark purple" maps to "darkmagenta".`,
    "",
    `Pick "css" with the closest name. Pick "none" only when the description is not a color at all.`,
  ].join("\n")

  return { prompt, schema: { type: "object", oneOf: branches } }
}

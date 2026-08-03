import type { PromptStage } from "./shared"

export interface ResolvePropertyValueInputs {
  propertyKey: string
  message: string
  /** Preset option values the property accepts (caller-derived). */
  options: string[]
  /** Theme token names the property accepts (caller-derived). */
  themeTokens: string[]
  /** Allowed units for exact numeric values (caller-derived). */
  units: string[]
  /** Whether the property schema's own `supports` list allows an exact value. */
  supportsExact: boolean
}

/**
 * Guidance lines and schema oneOf branches are built in lockstep: a branch
 * exists iff its guidance line does, so the model is only ever offered picks
 * the prompt described. Branch tagging (pick "theme" -> the property's
 * themeRefTag) must stay consistent with repair/normalize-actions.ts. The
 * exact branch is gated on `supportsExact` (the schema's own `supports` list)
 * so the model is never offered a shape the reducer will refuse.
 */
export function buildResolvePropertyValueStage(
  inputs: ResolvePropertyValueInputs,
): PromptStage {
  const branches: Record<string, unknown>[] = []
  const guidance: string[] = []
  const propertyHasPresetOptions = inputs.options.length > 0
  const propertyAcceptsThemeTokens = inputs.themeTokens.length > 0
  const propertyHasAllowedUnits = inputs.units.length > 0
  if (propertyHasPresetOptions) {
    branches.push({
      properties: {
        pick: { const: "option" },
        value: { type: "string", enum: inputs.options },
      },
      required: ["pick", "value"],
    })
    guidance.push(`- preset options: ${inputs.options.join(", ")}`)
  }
  if (propertyAcceptsThemeTokens) {
    branches.push({
      properties: {
        pick: { const: "theme" },
        value: { type: "string", enum: inputs.themeTokens },
      },
      required: ["pick", "value"],
    })
    guidance.push(`- theme tokens: ${inputs.themeTokens.join(", ")}`)
  }
  if (inputs.supportsExact) {
    branches.push({
      properties: {
        pick: { const: "exact" },
        value: { type: ["string", "number"] },
      },
      required: ["pick", "value"],
    })
    guidance.push(
      propertyHasAllowedUnits
        ? `- an exact value: a number (${inputs.units.join("|")}) or a string`
        : "- an exact value: a string or number",
    )
  }

  const prompt = [
    `A user wants to set the "${inputs.propertyKey}" property of a design element.`,
    "",
    `Message: ${JSON.stringify(inputs.message)}`,
    "",
    "The property accepts:",
    ...guidance,
    "",
    "Prefer a preset option or theme token when one matches the request; use exact only for a free value. Answer with the pick and the value.",
  ].join("\n")

  return { prompt, schema: { type: "object", oneOf: branches } }
}

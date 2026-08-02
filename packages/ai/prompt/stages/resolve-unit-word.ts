import type { PromptStage } from "./shared"

export interface ResolveUnitWordInputs {
  /** The property being set, so the model knows what the value measures. */
  propertyKey: string
  /** The unit word the model spoke, verbatim ("pixels", "percent"). */
  spokenUnit: string
  /** Canonical suffixes core allows for this property (caller-derived). */
  allowedUnits: string[]
}

/**
 * Fallback stage for a unit word that is not one of the property's canonical
 * suffixes, such as "pixels" for `px` or "percent" for `%`. The model picks
 * from a closed enum of core's own `units.allowed`, so the unit it names is
 * core's string rather than a word this package had to know in advance.
 *
 * The "unsupported" branch is the escape for a unit the property does not
 * measure in at all ("45 degrees" for a width). Without it the enum would
 * force a plausible-looking wrong unit onto a request that should fail, which
 * is worse than the error the user would otherwise get.
 */
export function buildResolveUnitWordStage(
  inputs: ResolveUnitWordInputs,
): PromptStage {
  const branches: Record<string, unknown>[] = [
    {
      properties: {
        pick: { const: "unit" },
        value: { type: "string", enum: inputs.allowedUnits },
      },
      required: ["pick", "value"],
    },
    {
      properties: {
        pick: { const: "unsupported" },
      },
      required: ["pick"],
    },
  ]

  const prompt = [
    `A user set the "${inputs.propertyKey}" property and spoke the unit ${JSON.stringify(inputs.spokenUnit)}.`,
    "",
    `That property is measured in: ${inputs.allowedUnits.join(", ")}.`,
    "",
    `Pick "unit" with the one the word means, for example "pixels" means "px" and "percent" means "%". Pick "unsupported" only when the spoken unit measures something this property cannot take, such as an angle on a length.`,
  ].join("\n")

  return { prompt, schema: { type: "object", oneOf: branches } }
}

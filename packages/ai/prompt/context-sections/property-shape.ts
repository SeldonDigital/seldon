import { findComponentSchema } from "@seldon/core/components/catalog"
import { COMPOUND_FACET_DISPLAY_ORDER } from "@seldon/core/properties/constants/shared/compound-properties"
import { BACKGROUND_KIND_VALUES } from "@seldon/core/properties/values/appearance/background/background-kind"

import { SHORTHAND_SIDES, propertyShape } from "../property-taxonomy"
import { section } from "./section"

const TITLE =
  "Property value shapes (set the facet or layer shown, never a flat value on the parent):"

/**
 * Context section: Property value shapes.
 *
 * The single most common mistake a model makes is writing a flat value onto a
 * key that expects a facet object, a side object, or an array of layers. The
 * vocabulary section lists which keys exist; this section tells the model how the
 * non-atomic ones must be shaped. Facet and side names come from core so the
 * shapes stay honest, and it covers only the non-atomic keys actually present in
 * the active tree, so the model sees the shapes it might need and nothing else.
 */
export function propertyShapeSection(catalogIds: Set<string>): string[] {
  const present = new Set<string>()
  for (const catalogId of catalogIds) {
    const schema = findComponentSchema(catalogId)
    if (!schema?.properties) continue
    for (const key of Object.keys(schema.properties)) {
      if (propertyShape(key) !== "atomic") present.add(key)
    }
  }

  const body: string[] = []
  for (const key of [...present].sort()) {
    const shape = propertyShape(key)
    if (shape === "layered" && key === "background") {
      body.push(
        `- background: array of layers. Each layer picks a kind (${BACKGROUND_KIND_VALUES.join(", ")}), then that kind's facets. A color layer: [{ "kind": { "type": "option", "value": "color" }, "color": <theme.categorical or exact> }]`,
      )
    } else if (shape === "layered") {
      const facets = COMPOUND_FACET_DISPLAY_ORDER[key] ?? []
      body.push(
        `- ${key}: array of layers. Each layer { ${facets.join(", ")} }`,
      )
    } else if (shape === "compound") {
      const facets = COMPOUND_FACET_DISPLAY_ORDER[key] ?? []
      body.push(`- ${key}: facet object { ${facets.join(", ")} }`)
    } else if (shape === "shorthand") {
      const sides = SHORTHAND_SIDES[key] ?? []
      body.push(`- ${key}: side object { ${sides.join(", ")} }`)
    }
  }
  return section(TITLE, body)
}

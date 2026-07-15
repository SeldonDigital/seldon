import { findComponentSchema } from "@seldon/core/components/catalog"
import { COMPOUND_FACET_DISPLAY_ORDER } from "@seldon/core/properties/constants/shared/compound-properties"
import { BACKGROUND_KIND_VALUES } from "@seldon/core/properties/values/appearance/background/background-kind"

import { SHORTHAND_SIDES, propertyShape } from "../property-taxonomy"
import { section } from "./section"

const TITLE =
  "Property value shapes (set the facet or layer shown, never a flat value on the parent):"

/**
 * A look is a compound or layered property whose facets include "preset": font,
 * border, and shadow. Its "preset" names a theme look and applies the whole
 * recipe, and setting any other facet overrides just that facet. Background also
 * carries a preset facet but reads as kind-driven paint, so it is not treated as
 * a look here.
 */
function isLook(key: string, facets: readonly string[]): boolean {
  return key !== "background" && facets.includes("preset")
}

/**
 * Context section: Property value shapes.
 *
 * The single most common mistake a model makes is writing a flat value onto a
 * key that expects a facet object, a side object, or an array of layers. The
 * vocabulary section lists which keys exist; this section tells the model how the
 * non-atomic ones must be shaped. Facet and side names come from core so the
 * shapes stay honest, and it covers only the non-atomic keys actually present in
 * the active tree, so the model sees the shapes it might need and nothing else.
 * Look keys get a trailing note on the preset-to-custom behavior, which is the
 * one shape rule that differs from plain compound, shorthand, and atomic keys.
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
  let hasLook = false
  for (const key of [...present].sort()) {
    const shape = propertyShape(key)
    const facets = COMPOUND_FACET_DISPLAY_ORDER[key] ?? []
    const look = isLook(key, facets)
    if (look) hasLook = true
    if (shape === "layered" && key === "background") {
      body.push(
        `- background: array of layers. Each layer picks a kind (${BACKGROUND_KIND_VALUES.join(", ")}), then that kind's facets. A color layer: [{ "kind": { "type": "option", "value": "color" }, "color": <theme.categorical or exact> }]`,
      )
    } else if (shape === "layered") {
      body.push(
        look
          ? `- ${key}: array of look layers { ${facets.join(", ")} }`
          : `- ${key}: array of layers. Each layer { ${facets.join(", ")} }`,
      )
    } else if (shape === "compound") {
      body.push(
        look
          ? `- ${key}: look, facet object { ${facets.join(", ")} }`
          : `- ${key}: facet object { ${facets.join(", ")} }`,
      )
    } else if (shape === "shorthand") {
      const sides = SHORTHAND_SIDES[key] ?? []
      body.push(`- ${key}: side object { ${sides.join(", ")} }`)
    }
  }
  if (hasLook) {
    body.push(
      'A look\'s "preset" applies a whole theme look (e.g. @font.body, @border.hairline). Set "preset" to switch looks. Set any other facet (size, weight, color, width) to override just it, which flips the look to custom so your value takes effect while unset facets keep the look. This differs from plain compound, shorthand, and atomic keys, which have no preset.',
    )
  }
  return section(TITLE, body)
}

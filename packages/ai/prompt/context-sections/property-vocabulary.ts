import { findComponentSchema } from "@seldon/core/components/catalog"
import {
  PROPERTY_DISPLAY_META,
  type PropertyDisplayCategory,
} from "@seldon/core/properties/constants/property-display"

import { section } from "./section"

const TITLE =
  "Property vocabulary (component -> settable property keys; only set keys listed here; for any key in the shapes legend below, use that value shape):"

/**
 * Context section: Property vocabulary.
 *
 * A property absent from a component's schema is not part of its vocabulary, and
 * core rejects any attempt to set it. Rather than let the model guess keys and
 * fail validation, this publishes the exact settable keys per component, read
 * live from the schema so the list can never drift from core. Only components in
 * the active tree appear, keeping the section scoped to what is on screen.
 *
 * Pass a `category` to list only that display category's keys, so a request that
 * touches one facet of a component does not pull its whole vocabulary.
 */
export function propertyVocabularySection(
  catalogIds: Set<string>,
  category?: PropertyDisplayCategory,
): string[] {
  const title = category
    ? `${TITLE.slice(0, -2)}; filtered to the "${category}" category):`
    : TITLE
  const body: string[] = []
  for (const catalogId of [...catalogIds].sort()) {
    const schema = findComponentSchema(catalogId)
    if (!schema) continue
    let keys = schema.properties ? Object.keys(schema.properties) : []
    if (category) {
      keys = keys.filter(
        (key) => PROPERTY_DISPLAY_META[key]?.displayCategory === category,
      )
    }
    body.push(
      `- ${catalogId} [${schema.level}]: ${keys.join(", ") || "(none)"}`,
    )
  }
  return section(title, body)
}

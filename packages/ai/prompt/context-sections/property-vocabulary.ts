import { findComponentSchema } from "@seldon/core/components/catalog"
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
 */
export function propertyVocabularySection(catalogIds: Set<string>): string[] {
  const body: string[] = []
  for (const catalogId of [...catalogIds].sort()) {
    const schema = findComponentSchema(catalogId)
    if (!schema) continue
    const keys = schema.properties ? Object.keys(schema.properties) : []
    body.push(`- ${catalogId} [${schema.level}]: ${keys.join(", ") || "(none)"}`)
  }
  return section(TITLE, body)
}

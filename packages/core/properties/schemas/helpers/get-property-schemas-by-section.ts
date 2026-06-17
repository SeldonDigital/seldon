import { PropertyDisplayCategory } from "../../constants/property-display"
import type { PropertySchema } from "../../types/schema"
import { getCatalogKeysForPropertySection } from "../sections"
import { getPropertySchema } from "./get-property-schema"

/**
 * Returns `PropertySchema` catalog entries for one inspector section, in `displayOrder` sequence.
 * Mirrors {@link getThemeTokenSchemasBySection} for theme token panels.
 */
export function getPropertySchemasBySection(
  sectionId: PropertyDisplayCategory,
): PropertySchema[] {
  const keys = getCatalogKeysForPropertySection(sectionId)
  if (!keys) return []

  const schemas = keys
    .map((key) => getPropertySchema(key))
    .filter((entry): entry is PropertySchema => entry !== undefined)

  return schemas.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
}

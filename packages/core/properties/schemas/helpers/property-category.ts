import { isCompoundCatalogProperty } from "../../constants/shared/compound-properties"
import { isShorthandCatalogProperty } from "../../constants/shared/shorthand-properties"
import type { PropertySchema } from "../../types/schema"
import { getPropertySchema } from "./get-property-schema"
import { joinCompoundFacetKey } from "./property-path"

/** Catalog grouping for a top-level property key. */
export type PropertyCategory = "atomic" | "compound" | "shorthand"

/**
 * Returns `compound`, `shorthand`, or `atomic` from the top-level property name.
 * Compound and shorthand lists live in `constants/shared/compound-properties.ts` and
 * `constants/shared/shorthand-properties.ts`.
 * Returns undefined when the name is absent from both lists and from the catalog schema map.
 */
export function getPropertyCategory(
  propertyName: string,
): PropertyCategory | undefined {
  if (isShorthandCatalogProperty(propertyName)) return "shorthand"
  if (isCompoundCatalogProperty(propertyName)) return "compound"

  const schema = getPropertySchema(propertyName)
  if (!schema) {
    return undefined
  }

  return "atomic"
}

/**
 * Resolves `parentProperty` + `subProperty` to the flattened catalog key and returns that schema.
 */
export function getCompoundSubPropertySchema(
  parentProperty: string,
  subProperty: string,
): PropertySchema | undefined {
  return getPropertySchema(joinCompoundFacetKey(parentProperty, subProperty))
}

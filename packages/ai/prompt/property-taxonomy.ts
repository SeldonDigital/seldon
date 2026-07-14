import { PROPERTY_COMPOUND_CATALOG } from "@seldon/core/properties/constants/shared/compound-properties"
import { PROPERTY_SHORTHAND_KEYS } from "@seldon/core/properties/constants/shared/shorthand-properties"
import { getPropertySchema } from "@seldon/core/properties/schemas/helpers/get-property-schema"

/**
 * Property shape taxonomy, derived live from core catalogs. See
 * `packages/core/properties/README.md` for the shape definitions. Shared by the
 * context builder and the action repair pass so both classify keys the same.
 */
export const LAYERED_KEYS = new Set<string>(
  PROPERTY_COMPOUND_CATALOG.filter(
    (entry) => entry.nodeStorage === "layered",
  ).map((entry) => entry.key),
)
export const COMPOUND_FACET_KEYS = new Set<string>(
  PROPERTY_COMPOUND_CATALOG.filter(
    (entry) => entry.nodeStorage === "facets",
  ).map((entry) => entry.key),
)
export const SHORTHAND_KEYS = new Set<string>(PROPERTY_SHORTHAND_KEYS)

/** Side and corner facet names for each shorthand parent. */
export const SHORTHAND_SIDES: Record<string, readonly string[]> = {
  margin: ["top", "right", "bottom", "left"],
  padding: ["top", "right", "bottom", "left"],
  position: ["top", "right", "bottom", "left"],
  corners: ["topLeft", "topRight", "bottomLeft", "bottomRight"],
}

export type PropertyShape = "atomic" | "compound" | "shorthand" | "layered"

/** Classifies a top-level property key by how its value is stored on a node. */
export function propertyShape(key: string): PropertyShape {
  if (LAYERED_KEYS.has(key)) return "layered"
  if (COMPOUND_FACET_KEYS.has(key)) return "compound"
  if (SHORTHAND_KEYS.has(key)) return "shorthand"
  return "atomic"
}

const VALUE_TYPE_TAGS = new Set<string>([
  "exact",
  "option",
  "theme.categorical",
  "theme.ordinal",
  "inherit",
  "empty",
  "computed",
])

/** True when a value is a single tagged property value, e.g. { type, value }. */
export function isTaggedValue(
  value: unknown,
): value is { type: string; value: unknown } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false
  }
  const tag = (value as { type?: unknown }).type
  return typeof tag === "string" && VALUE_TYPE_TAGS.has(tag)
}

/**
 * Returns the theme value-type tag an atomic property accepts for `@scope.key`
 * references, read from its core schema `supports`. Ordered scales report
 * `theme.ordinal` and named sets report `theme.categorical`. Properties with no
 * theme support report null, so a coercion pass leaves the value for core
 * validation to reject precisely. No property supports both theme kinds, so the
 * tag is unambiguous, and this stays correct as core property schemas evolve.
 */
export function themeRefTag(
  propertyKey: string,
): "theme.ordinal" | "theme.categorical" | null {
  const supports = getPropertySchema(propertyKey)?.supports
  if (!supports) return null
  if (supports.includes("themeOrdinal")) return "theme.ordinal"
  if (supports.includes("themeCategorical")) return "theme.categorical"
  return null
}

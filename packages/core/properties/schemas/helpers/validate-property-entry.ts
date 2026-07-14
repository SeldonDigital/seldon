import type { Theme } from "../../../themes/types"
import {
  PROPERTY_COMPOUND_CATALOG,
  isCompoundCatalogProperty,
} from "../../constants/shared/compound-properties"
import { isShorthandCatalogProperty } from "../../constants/shared/shorthand-properties"
import { ValueType } from "../../constants/shared/value-types"
import type { PropertyValueType } from "../../types/schema"
import { getPropertySchema } from "./get-property-schema"
import {
  getCatalogKeyForPropertyPath,
  joinCompoundFacetKey,
} from "./property-path"

/** True when a compound parent stores its node value as an ordered layer array. */
function isLayeredCompound(propertyKey: string): boolean {
  return PROPERTY_COMPOUND_CATALOG.some(
    (entry) => entry.key === propertyKey && entry.nodeStorage === "layered",
  )
}

/** One malformed value found while validating a property entry. */
export interface PropertyValueError {
  /** Dot path of the offending value, for example `background.0.color`. */
  path: string
  reason: string
}

/** Maps a stored `ValueType` tag to its schema validation shape key. */
const VALUE_TYPE_TO_SHAPE: Record<ValueType, PropertyValueType> = {
  [ValueType.EMPTY]: "empty",
  [ValueType.INHERIT]: "inherit",
  [ValueType.EXACT]: "exact",
  [ValueType.OPTION]: "option",
  [ValueType.COMPUTED]: "computed",
  [ValueType.THEME_CATEGORICAL]: "themeCategorical",
  [ValueType.THEME_ORDINAL]: "themeOrdinal",
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isTaggedValue(
  value: unknown,
): value is { type: unknown; value?: unknown } {
  return isPlainObject(value) && "type" in value
}

/**
 * Validates one stored tagged value `{ type, value }` against its flattened
 * property schema. `EMPTY` is always allowed because an unset value is a
 * structural state every property may hold. Every other shape must be listed in
 * the schema `supports` set and pass its per-shape validator.
 */
function validateSingle(
  schemaKey: string,
  value: unknown,
  theme: Theme | undefined,
  path: string,
): PropertyValueError[] {
  if (!isTaggedValue(value)) {
    return [{ path, reason: "expected a tagged value { type, value }" }]
  }

  const shape = VALUE_TYPE_TO_SHAPE[value.type as ValueType]
  if (!shape) {
    return [{ path, reason: `unknown value type "${String(value.type)}"` }]
  }

  if (shape === "empty") return []

  const schema = getPropertySchema(schemaKey)
  if (!schema) {
    return [{ path, reason: `no schema for property "${schemaKey}"` }]
  }

  if (!schema.supports.includes(shape)) {
    return [
      {
        path,
        reason: `${shape} is not allowed here (supports: ${schema.supports.join(", ")})`,
      },
    ]
  }

  const validator = schema.validation[shape]
  if (validator && !validator(value.value, theme)) {
    return [{ path, reason: `invalid ${shape} value for ${schemaKey}` }]
  }

  return []
}

/** Validates one compound or layer facet by flattening it to its schema key. */
function validateFacet(
  parent: string,
  facet: string,
  value: unknown,
  theme: Theme | undefined,
  path: string,
): PropertyValueError[] {
  const schemaKey = joinCompoundFacetKey(parent, facet)
  if (!getPropertySchema(schemaKey)) {
    return [{ path, reason: `unknown facet "${facet}" on ${parent}` }]
  }
  return validateSingle(schemaKey, value, theme, path)
}

/**
 * Validates one property entry from an action payload against the property
 * schemas, returning every malformed value found. An empty array means the entry
 * is well formed.
 *
 * Handles the storage shapes a node override can take:
 * - a dotted path such as `border.color` or `background.0.color`, resolved to a
 *   single flattened schema,
 * - a layered paint parent (`background`, `shadow`) as an array of layer objects,
 * - a compound parent (`border*`, `font`, `board`) as an object of facets,
 * - a shorthand parent (`margin`, `padding`, `corners`, `position`) as an object
 *   of sides, and
 * - an atomic property as a single tagged value.
 */
export function collectPropertyValueErrors(
  propertyKey: string,
  value: unknown,
  theme?: Theme,
): PropertyValueError[] {
  if (propertyKey.includes(".")) {
    const schemaKey = getCatalogKeyForPropertyPath(propertyKey)
    if (!schemaKey) {
      return [{ path: propertyKey, reason: "unknown property path" }]
    }
    return validateSingle(schemaKey, value, theme, propertyKey)
  }

  if (isLayeredCompound(propertyKey)) {
    if (!Array.isArray(value)) {
      return [{ path: propertyKey, reason: "expected an array of layers" }]
    }
    const errors: PropertyValueError[] = []
    value.forEach((layer, index) => {
      if (!isPlainObject(layer)) {
        errors.push({
          path: `${propertyKey}.${index}`,
          reason: "layer must be an object of facets",
        })
        return
      }
      for (const [facet, facetValue] of Object.entries(layer)) {
        errors.push(
          ...validateFacet(
            propertyKey,
            facet,
            facetValue,
            theme,
            `${propertyKey}.${index}.${facet}`,
          ),
        )
      }
    })
    return errors
  }

  if (isCompoundCatalogProperty(propertyKey)) {
    if (!isPlainObject(value)) {
      return [{ path: propertyKey, reason: "expected a facet object" }]
    }
    const errors: PropertyValueError[] = []
    for (const [facet, facetValue] of Object.entries(value)) {
      errors.push(
        ...validateFacet(
          propertyKey,
          facet,
          facetValue,
          theme,
          `${propertyKey}.${facet}`,
        ),
      )
    }
    return errors
  }

  // A shorthand stores an object of sides that all share the parent schema.
  if (
    isShorthandCatalogProperty(propertyKey) &&
    isPlainObject(value) &&
    !isTaggedValue(value)
  ) {
    const errors: PropertyValueError[] = []
    for (const [side, sideValue] of Object.entries(value)) {
      errors.push(
        ...validateSingle(
          propertyKey,
          sideValue,
          theme,
          `${propertyKey}.${side}`,
        ),
      )
    }
    return errors
  }

  const schemaKey = getCatalogKeyForPropertyPath(propertyKey)
  if (!schemaKey) {
    return [{ path: propertyKey, reason: "unknown property" }]
  }
  return validateSingle(schemaKey, value, theme, propertyKey)
}

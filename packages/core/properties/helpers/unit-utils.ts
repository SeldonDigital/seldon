import { Unit } from "../constants"
import {
  getCompoundSubPropertySchema,
  getPropertySchema,
} from "../schemas/helpers"

/** Maps a dot path to the catalog key that carries `units` on its schema. */
function resolveSchemaKeyForUnits(propertyKey: string): string {
  if (!propertyKey.includes(".")) {
    return propertyKey
  }
  const parts = propertyKey.split(".")
  const first = parts[0]!
  const last = parts[parts.length - 1]!
  const compoundFacet = getCompoundSubPropertySchema(first, last)
  if (compoundFacet) {
    return compoundFacet.name
  }
  if (parts.length === 2 && getPropertySchema(first)) {
    return first
  }
  return last
}

/** Lists allowed unit suffixes for measured values on this property. */
export function getUnitsForProperty(propertyKey: string): string[] {
  const schema = getPropertySchema(resolveSchemaKeyForUnits(propertyKey))
  if (schema?.units?.allowed) {
    return schema.units.allowed.map((unit) => unit)
  }
  return [Unit.PX, Unit.REM, Unit.PERCENT]
}

/** Returns the default unit when the editor inserts a new measured value. */
export function getDefaultUnitForProperty(propertyKey: string): Unit {
  const schema = getPropertySchema(resolveSchemaKeyForUnits(propertyKey))
  return schema?.units?.default ?? Unit.PX
}

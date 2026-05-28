import type { PropertySchema } from "../../types/schema"
import { PROPERTY_SCHEMAS } from "../data/property-schemas"

/** Returns the full property schema catalog (same object as `PROPERTY_SCHEMAS` and `PROPERTY_SCHEMA_CATALOG`). */
export function getAllPropertySchemas(): Record<string, PropertySchema> {
  return PROPERTY_SCHEMAS
}

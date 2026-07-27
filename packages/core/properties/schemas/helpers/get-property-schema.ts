import { PROPERTY_SCHEMAS } from "../data/property-schemas"

import type { PropertySchema } from "../../types/schema"

/** Returns the schema for a flattened property name, or undefined if absent from the catalog. */
export function getPropertySchema(propertyName: string): PropertySchema | undefined {
  return PROPERTY_SCHEMAS[propertyName as keyof typeof PROPERTY_SCHEMAS]
}

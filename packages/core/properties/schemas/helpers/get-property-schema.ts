import type { PropertySchema } from "../../types/schema"
import { PROPERTY_SCHEMAS } from "../data/property-schemas"

/** Returns the schema for a flattened property name, or undefined if absent from the catalog. */
export function getPropertySchema(
  propertyName: string,
): PropertySchema | undefined {
  return PROPERTY_SCHEMAS[propertyName as keyof typeof PROPERTY_SCHEMAS]
}

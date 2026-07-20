/**
 * Hook for property validation logic
 */
import { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"
import { getValidationFunction } from "@seldon/editor/lib/properties/inspector/property-validation"

interface UsePropertyValidationResult {
  validationFunction: ((value: string) => boolean) | undefined
}

/**
 * Returns the validation function for a property. Thin React wrapper over the
 * shared `getValidationFunction` so both editors reject the same inputs.
 */
export function usePropertyValidation(
  property: FlatProperty,
): UsePropertyValidationResult {
  return {
    validationFunction: getValidationFunction(property),
  }
}

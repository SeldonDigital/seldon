// Property processing utilities
export * from "./compound-properties"
export { flattenNestedOverridesObject } from "./flatten-nested-overrides-object"
export { processNestedOverridesProps } from "./process-nested-overrides-props"
export { removeAllowedValuesFromProperties } from "./remove-allowed-values"
export { stringifyValue } from "./stringify-value"
export * from "./properties-ui-bridge"

// Re-export commonly used constants for convenience
export {
  Unit,
  ValueType,
  ComputedFunction,
  EMPTY_VALUE,
} from "../../properties/constants"

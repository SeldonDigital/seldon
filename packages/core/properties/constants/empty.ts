import { ValueType } from "./value-types"

/**
 * Empty value constant for unset properties.
 */
export const EMPTY_VALUE = {
  type: ValueType.EMPTY,
  value: null,
} as const

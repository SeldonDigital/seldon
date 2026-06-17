import { ValueType } from "../../../constants"

/** Stores a boolean as a freeform exact value (true/false typed in directly). */
export type BooleanValue = {
  type: ValueType.EXACT
  value: boolean
}

/** Stores a boolean as an option pick from the schema's preset list (true/false). */
export type BooleanOptionValue = {
  type: ValueType.OPTION
  value: boolean
}

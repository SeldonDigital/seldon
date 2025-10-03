import { ValueType } from "../../constants/value-types"

/**
 * The value CAN be set but initially it is not.
 **/
export type EmptyValue = {
  type: ValueType.EMPTY
  value: null
}

import { ValueType } from "../../constants/value-types"

/**
 * Right now InheritValue is using the CSS inherit keyword.
 * We should instead make values inherit other values programmatically.
 * This is a more robust solution that will allow us to inherit values from
 * other values in a more predictable way.
 *
 * https://github.com/SeldonDigital/seldon/issues/1058
 */
export type InheritValue = {
  type: ValueType.INHERIT
  value: null
}

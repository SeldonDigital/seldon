import { ValueType } from "../../../constants"
import { BasedOnPropertyKey } from "./based-on-property-key"
import { ComputedFunction } from "./computed"

export type ComputedOpticalPaddingValue = {
  type: ValueType.COMPUTED
  value: {
    function: ComputedFunction.OPTICAL_PADDING
    input: {
      basedOn: BasedOnPropertyKey
    }
  }
}

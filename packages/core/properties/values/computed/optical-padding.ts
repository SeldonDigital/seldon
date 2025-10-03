import { ComputedFunction, ValueType } from "../../constants"
import { BasedOnPropertyKey } from "../shared/based-on-property-key"

export type ComputedOpticalPaddingValue = {
  type: ValueType.COMPUTED
  value: {
    function: ComputedFunction.OPTICAL_PADDING
    input: {
      basedOn: BasedOnPropertyKey
      factor: number
    }
  }
}

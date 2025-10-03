import { ComputedFunction, ValueType } from "../../constants"
import { BasedOnPropertyKey } from "../shared/based-on-property-key"

export type ComputedAutoFitValue = {
  type: ValueType.COMPUTED
  value: {
    function: ComputedFunction.AUTO_FIT
    input: {
      basedOn: BasedOnPropertyKey
      factor: number
    }
  }
}

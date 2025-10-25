import { ValueType } from "../../../constants"
import { BasedOnPropertyKey } from "./based-on-property-key"
import { ComputedFunction } from "./computed-functions"

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

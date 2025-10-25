import { ValueType } from "../../../constants"
import { BasedOnPropertyKey } from "./based-on-property-key"
import { ComputedFunction } from "./computed-functions"

export type ComputedMatchValue = {
  type: ValueType.COMPUTED
  value: {
    function: ComputedFunction.MATCH
    input: {
      basedOn: BasedOnPropertyKey
    }
  }
}

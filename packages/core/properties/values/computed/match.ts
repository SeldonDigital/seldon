import { ComputedFunction, ValueType } from "../../constants"
import { BasedOnPropertyKey } from "../shared/based-on-property-key"

export type ComputedMatchValue = {
  type: ValueType.COMPUTED
  value: {
    function: ComputedFunction.MATCH
    input: {
      basedOn: BasedOnPropertyKey
    }
  }
}

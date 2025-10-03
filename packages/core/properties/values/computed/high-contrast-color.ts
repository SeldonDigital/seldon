import { ComputedFunction, ValueType } from "../../constants"
import { BasedOnPropertyKey } from "../shared/based-on-property-key"

export type ComputedHighContrastValue = {
  type: ValueType.COMPUTED
  value: {
    function: ComputedFunction.HIGH_CONTRAST_COLOR
    input: {
      basedOn: BasedOnPropertyKey
    }
  }
}

import { ValueType } from "../../../constants"
import { BasedOnPropertyKey } from "./based-on-property-key"
import { ComputedFunction } from "./computed-functions"

export type ComputedHighContrastValue = {
  type: ValueType.COMPUTED
  value: {
    function: ComputedFunction.HIGH_CONTRAST_COLOR
    input: {
      basedOn: BasedOnPropertyKey
    }
  }
}

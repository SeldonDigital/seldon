import { isComputedFunction } from "../../../helpers/type-guards/value/is-computed-value"
import { ComputedFunction, Unit, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { ComputedAutoFitValue } from "../shared/computed/auto-fit"
import { EmptyValue } from "../shared/empty/empty"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"
import { Resize } from "./resize"
import { ScreenSize } from "./screen-size"

/** Picks fit, fill, or a device size band for board height. */
export interface ScreenHeightOptionValue {
  type: ValueType.OPTION
  value: Resize | ScreenSize
}

/** Board height as unset, px or rem lengths, auto-fit computed, or a resize or device option. */
export type ScreenHeightValue =
  | EmptyValue
  | ScreenHeightOptionValue
  | PixelValue
  | RemValue
  | ComputedAutoFitValue

export const screenHeightSchema: PropertySchema = {
  name: "screenHeight",
  description:
    "Sets board height using pixels, root lengths, auto-fit, or a resize or device size choice.",
  supports: ["empty", "exact", "option", "computed"] as const,
  units: {
    allowed: [Unit.PX, Unit.REM],
    default: Unit.PX,
    validation: "both",
  },
  validation: {
    empty: () => true,
    exact: (value: unknown) => {
      if (
        typeof value === "object" &&
        value !== null &&
        "value" in value &&
        "unit" in value &&
        value.value !== undefined &&
        value.unit !== undefined
      )
        return true
      if (typeof value === "number" && value > 0) return true
      return false
    },
    option: (value: unknown) =>
      typeof value === "string" &&
      ((Object.values(Resize) as string[]).includes(value) ||
        (Object.values(ScreenSize) as string[]).includes(value)),
    computed: (value: unknown) => isComputedFunction(value),
  },
  presetOptions: () => [...Object.values(Resize), ...Object.values(ScreenSize)],
  computedFunctions: () => [ComputedFunction.AUTO_FIT],
}

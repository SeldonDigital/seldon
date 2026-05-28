import { ComputedFunction, Unit, ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { ComputedAutoFitValue } from "../shared/computed/auto-fit"
import { EmptyValue } from "../shared/empty/empty"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"
import { Resize } from "./resize"
import { ScreenSize } from "./screen-size"

/** Picks fit, fill, or a device size band for board width. */
export interface ScreenWidthOptionValue {
  type: ValueType.OPTION
  value: Resize | ScreenSize
}

/** Board width as unset, px or rem lengths, auto-fit computed, or a resize or device option. */
export type ScreenWidthValue =
  | EmptyValue
  | ScreenWidthOptionValue
  | PixelValue
  | RemValue
  | ComputedAutoFitValue

export const screenWidthSchema: PropertySchema = {
  name: "screenWidth",
  description:
    "Sets board width using pixels, root lengths, auto-fit, or a resize or device size choice.",
  supports: ["empty", "exact", "option", "computed"] as const,
  units: {
    allowed: [Unit.PX, Unit.REM],
    default: Unit.PX,
    validation: "both",
  },
  validation: {
    empty: () => true,
    exact: (value: any) => {
      if (
        typeof value === "object" &&
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
    computed: (value: any) =>
      typeof value === "object" && value.function !== undefined,
  },
  presetOptions: () => [...Object.values(Resize), ...Object.values(ScreenSize)],
  computedFunctions: () => [ComputedFunction.AUTO_FIT],
}

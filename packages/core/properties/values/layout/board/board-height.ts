import { Unit, ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"
import { Resize } from "../resize"

/** Sets board height to fit its content. */
export interface BoardHeightFitOptionValue {
  type: ValueType.OPTION
  value: typeof Resize.FIT
}

/** Board height as unset, px or rem lengths, or fit. */
export type BoardHeightValue =
  | EmptyValue
  | BoardHeightFitOptionValue
  | PixelValue
  | RemValue

export const boardHeightSchema: PropertySchema = {
  name: "boardHeight",
  description: "Sets board height using pixels, root lengths, or fit.",
  supports: ["empty", "exact", "option"] as const,
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
        "unit" in value
      ) {
        return true
      }
      return typeof value === "number" && value > 0
    },
    option: (value: unknown) => value === Resize.FIT,
  },
  presetOptions: () => [Resize.FIT],
}

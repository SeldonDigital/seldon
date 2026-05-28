import { Unit, ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PixelValue } from "../../shared/exact/pixel"
import { RemValue } from "../../shared/exact/rem"
import { Resize } from "../resize"

/** Sets board width to fit its content. */
export interface BoardWidthFitOptionValue {
  type: ValueType.OPTION
  value: typeof Resize.FIT
}

/** Board width as unset, px or rem lengths, or fit. */
export type BoardWidthValue =
  | EmptyValue
  | BoardWidthFitOptionValue
  | PixelValue
  | RemValue

export const boardWidthSchema: PropertySchema = {
  name: "boardWidth",
  description:
    "Sets board width using pixels, root lengths, or fit.",
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

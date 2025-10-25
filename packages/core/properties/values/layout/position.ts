import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

export interface PositionValue {
  top?: PositionSideValue
  right?: PositionSideValue
  bottom?: PositionSideValue
  left?: PositionSideValue
}

export type PositionSideValue = EmptyValue | PixelValue | RemValue

export const positionSchema: PropertySchema = {
  name: "position",
  description: "Element positioning values",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => {
      if (
        typeof value === "object" &&
        value.value !== undefined &&
        value.unit !== undefined
      )
        return true
      if (typeof value === "number") return true
      return false
    },
  },
}

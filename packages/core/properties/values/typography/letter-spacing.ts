import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { PixelValue } from "../shared/exact/pixel"
import { RemValue } from "../shared/exact/rem"

export type LetterSpacingValue = EmptyValue | PixelValue | RemValue

export const letterSpacingSchema: PropertySchema = {
  name: "letterSpacing",
  description: "Letter spacing for text styling",
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

import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { PercentageValue } from "../../shared/exact/percentage"

export type BorderOpacityValue = EmptyValue | PercentageValue

export const borderOpacitySchema: PropertySchema = {
  name: "borderOpacity",
  description: "Border opacity level",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => {
      if (
        typeof value === "object" &&
        value.value !== undefined &&
        value.unit === "%"
      )
        return true
      if (typeof value === "number" && value >= 0 && value <= 100) return true
      return false
    },
  },
}

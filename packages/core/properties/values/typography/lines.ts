import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { NumberValue } from "../shared/exact/number"

export type LinesValue = EmptyValue | NumberValue

export const linesSchema: PropertySchema = {
  name: "lines",
  description: "Number of lines for text layout",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) =>
      typeof value === "number" && Number.isInteger(value) && value > 0,
  },
}

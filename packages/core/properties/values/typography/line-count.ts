import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { NumberValue } from "../shared/exact/number"

export type LineCountValue = EmptyValue | NumberValue

export const lineCountSchema: PropertySchema = {
  name: "lineCount",
  description: "Number of lines for text display",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) =>
      typeof value === "number" && Number.isInteger(value) && value > 0,
  },
}

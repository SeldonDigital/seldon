import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { NumberValue } from "../shared/exact/number"

export type RowCountValue = EmptyValue | NumberValue

export const rowsSchema: PropertySchema = {
  name: "rows",
  description: "Number of rows in grid layout",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) =>
      typeof value === "number" && Number.isInteger(value) && value > 0,
  },
}

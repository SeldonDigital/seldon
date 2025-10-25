import { Unit } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { NumberValue } from "../shared/exact/number"

export type ColumnCountValue = EmptyValue | NumberValue

export const columnsSchema: PropertySchema = {
  name: "columns",
  description: "Number of columns in grid layout",
  supports: ["empty", "inherit", "exact"] as const,
  units: {
    allowed: [],
    default: Unit.NUMBER,
    validation: "number",
  },
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) =>
      typeof value === "number" && Number.isInteger(value) && value > 0,
  },
}

import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/** Merged borders where cells meet, or a border drawn for each cell. */
export enum BorderCollapse {
  SEPARATE = "separate",
  COLLAPSE = "collapse",
}

/** Stores one border-collapse keyword as a freeform exact value. */
export interface BorderCollapseExactValue {
  type: ValueType.EXACT
  value: BorderCollapse
}

/** Stores one border-collapse keyword as an option value. */
export interface BorderCollapseOptionValue {
  type: ValueType.OPTION
  value: BorderCollapse
}

/** Unset, a freeform exact value, or a picked separate/collapse choice for table borders. */
export type BorderCollapseValue =
  | EmptyValue
  | BorderCollapseExactValue
  | BorderCollapseOptionValue

export const borderCollapseSchema: PropertySchema = {
  name: "borderCollapse",
  description:
    "Sets whether table borders stay apart for each cell or merge where cells meet.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(BorderCollapse) as string[]).includes(value),
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(BorderCollapse) as string[]).includes(value),
  },
  presetOptions: () => Object.values(BorderCollapse),
}

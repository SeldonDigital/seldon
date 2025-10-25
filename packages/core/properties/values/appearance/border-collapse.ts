import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export enum BorderCollapse {
  SEPARATE = "separate",
  COLLAPSE = "collapse",
}

export interface BorderCollapsePresetValue {
  type: ValueType.PRESET
  value: BorderCollapse
}

export type BorderCollapseValue = EmptyValue | BorderCollapsePresetValue

export const borderCollapseSchema: PropertySchema = {
  name: "borderCollapse",
  description: "Table border collapse behavior",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(BorderCollapse).includes(value),
  },
  presetOptions: () => Object.values(BorderCollapse),
}

import { IconId, iconIds, iconLabels } from "../../../components/icons"
import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export interface SymbolPresetValue {
  type: ValueType.PRESET
  value: IconId | string
}

export type SymbolValue = EmptyValue | SymbolPresetValue

export const symbolSchema: PropertySchema = {
  name: "symbol",
  description: "Icon symbol identifier",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => typeof value === "string" && value.length > 0,
  },
  presetOptions: () => {
    return iconIds.map((id) => ({
      value: id,
      name: iconLabels[id],
    }))
  },
}

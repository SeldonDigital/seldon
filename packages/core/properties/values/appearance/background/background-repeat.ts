import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"

export enum BackgroundRepeat {
  REPEAT = "repeat",
  NO_REPEAT = "no-repeat",
}

export interface BackgroundRepeatPresetValue {
  type: ValueType.PRESET
  value: BackgroundRepeat
}

export type BackgroundRepeatValue = EmptyValue | BackgroundRepeatPresetValue

export const backgroundRepeatSchema: PropertySchema = {
  name: "backgroundRepeat",
  description: "Background image repeat behavior",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(BackgroundRepeat).includes(value),
  },
  presetOptions: () => Object.values(BackgroundRepeat),
}

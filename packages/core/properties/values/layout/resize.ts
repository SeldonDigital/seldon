import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export enum Resize {
  FIT = "fit",
  FILL = "fill",
}

export enum ScreenSize {
  DESKTOP = "desktop",
  LAPTOP = "laptop",
  TABLET = "tablet",
  MOBILE = "mobile",
  WATCH = "watch",
  TELEVISION = "television",
}

export interface ResizePresetValue {
  type: ValueType.PRESET
  value: Resize
}

export type ResizeValue = EmptyValue | ResizePresetValue

export const resizeSchema: PropertySchema = {
  name: "resize",
  description: "Element resize behavior",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(Resize).includes(value),
  },
  presetOptions: () => Object.values(Resize),
}

export const screenSizeSchema: PropertySchema = {
  name: "screenSize",
  description: "Device screen size presets",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(ScreenSize).includes(value),
  },
  presetOptions: () => Object.values(ScreenSize),
}

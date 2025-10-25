import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../empty/empty"

/**
 * Image fit values for image sizing behavior.
 */
export enum ImageFit {
  ORIGINAL = "original",
  CONTAIN = "contain",
  COVER = "cover",
  STRETCH = "stretch",
}

/**
 * Readable image fit options for interface.
 */
export const IMAGE_FIT_OPTIONS: { name: string; value: ImageFit }[] = [
  { name: "Original", value: ImageFit.ORIGINAL },
  { name: "Cover", value: ImageFit.COVER },
  { name: "Contain", value: ImageFit.CONTAIN },
  { name: "Stretch", value: ImageFit.STRETCH },
]

export interface ImageFitPresetValue {
  type: ValueType.PRESET
  value: ImageFit
}

export type ImageFitValue = EmptyValue | ImageFitPresetValue

export const imageFitSchema: PropertySchema = {
  name: "imageFit",
  description: "Image sizing behavior",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(ImageFit).includes(value),
  },
  presetOptions: () => Object.values(ImageFit),
}

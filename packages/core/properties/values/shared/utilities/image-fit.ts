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

/** Stores an image fit keyword as a freeform exact value from the ImageFit enum. */
export interface ImageFitExactValue {
  type: ValueType.EXACT
  value: ImageFit
}

export interface ImageFitOptionValue {
  type: ValueType.OPTION
  value: ImageFit
}

export type ImageFitValue =
  | EmptyValue
  | ImageFitExactValue
  | ImageFitOptionValue

export const imageFitSchema: PropertySchema = {
  name: "imageFit",
  description: "Image sizing behavior",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(ImageFit) as string[]).includes(value),
  },
  presetOptions: () => Object.values(ImageFit),
}

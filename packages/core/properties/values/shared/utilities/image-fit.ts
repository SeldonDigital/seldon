import type { ValueType } from "../../../constants"
import type { PropertySchema } from "../../../types/schema"
import type { EmptyValue } from "../empty/empty"

/**
 * Image fit values for image sizing behavior.
 */
export enum ImageFit {
  ORIGINAL = "original",
  CONTAIN = "contain",
  COVER = "cover",
  STRETCH = "stretch",
}

export interface ImageFitOptionValue {
  type: ValueType.OPTION
  value: ImageFit
}

export type ImageFitValue = EmptyValue | ImageFitOptionValue

export const imageFitSchema: PropertySchema = {
  name: "imageFit",
  description: "Image sizing behavior",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" && (Object.values(ImageFit) as string[]).includes(value),
  },
  presetOptions: () => Object.values(ImageFit),
}
